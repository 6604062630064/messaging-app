import { body, cookie, validationResult } from "express-validator";
import { Request, Response } from "express";
import sql from "../db";
import axios from "axios";
const { SERVER_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PRIVATE_KEY } =
	process.env;
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const queryString = require("query-string");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const redirectUrl = "/auth/google";

const getGoogleAuthURL: () => string = () => {
	const rootUrl = "https://accounts.google.com/o/oauth2/auth";

	const options = {
		redirect_uri: `${SERVER_URL}${redirectUrl}`,
		client_id: GOOGLE_CLIENT_ID,
		response_type: `code`,
		access_type: `offline`,
		prompt: "select_account",
		ux_mode: "popup",
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		].join(" "),
	};

	return `${rootUrl}?${queryString.stringify(options)}`;
};
console.log(getGoogleAuthURL());
const getTokens = async ({
	code,
	clientId,
	clientSecret,
	redirectUrl,
}: {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUrl: string;
}) => {
	const url = "https://oauth2.googleapis.com/token";
	const values = {
		code: code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUrl,
		grant_type: "authorization_code",
	};
	return axios
		.post(
			"https://oauth2.googleapis.com/token",
			queryString.stringify(values),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {});
};

exports.googleAuth_GET = asyncHandler(async (req: Request, res: Response) => {
	const code = req.query.code as string;

	const { id_token, access_token } = await getTokens({
		code: code,
		clientId: GOOGLE_CLIENT_ID as string,
		clientSecret: GOOGLE_CLIENT_SECRET as string,
		redirectUrl: `${SERVER_URL}${redirectUrl}`,
	});
	const response = await axios.get(
		"https://www.googleapis.com/userinfo/v2/me",
		{
			headers: {
				Authorization: "Bearer " + access_token,
			},
		}
	);

	const googleUser = response.data;
	let checkDB =
		await sql`select id, username, created from Users where external_id = ${googleUser.id}`;
	if (!checkDB.count) {
		checkDB = await sql`insert into Users ${sql({
			username: googleUser.name,
			role: "guest",
			created: Date.now(),
			avatar: googleUser.picture,
			external_type: "google",
			external_id: googleUser.id,
		})} returning id, username, created`;
	}

	const token = jwt.sign(checkDB[0], PRIVATE_KEY, { expiresIn: "2 day" });

	return res
		.cookie("token", token)
		.status(202)
		.send(`<script>window.close();</script> `);
});

exports.checkLogin_GET = [
	cookie("token").exists(),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array({ onlyFirstError: true }));
		}

		const token = req.cookies.token;

		try {
			const data = jwt.verify(token, PRIVATE_KEY);
			const dbResponse =
				await sql`select username, role, avatar from Users where id = ${data.id}`;
			return res.status(200).json(dbResponse[0]);
		} catch (err) {
			return res.sendStatus(401);
		}
	}),
];

exports.localSignup_POST = [
	body("username")
		.escape()
		.custom(async (v) => {
			const dbCheck = await sql`select 1 from Users where username = ${v}`;
			if (dbCheck.count) {
				throw new Error("This username already exists.");
			} else {
				return true;
			}
		})
		.isLength({ min: 4, max: 13 })
		.withMessage("Invalid length")
		.matches(/^[a-zA-Z0-9_-]+$/)
		.withMessage("Invalid character(s)"),
	body("password")
		.escape()
		.isLength({ min: 6, max: 32 })
		.withMessage("Invalid length")
		.matches(/^[a-zA-Z0-9_-]+$/)
		.withMessage("Invalid character(s)"),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);
		const { username, password } = req.body;
		if (!result.isEmpty()) {
			return res.status(401).json(result.array());
		}
		const encryptedPassword = await bcrypt.hash(password, saltRounds);
		const response = await sql`insert into Users ${sql({
			username: username,
			password: encryptedPassword,
			role: "guest",
			avatar: "default",
			external_type: "native",
			created: Date.now(),
		})} returning id, username, created`;

		const token = jwt.sign(response[0], PRIVATE_KEY, { expiresIn: "2 day" });
		return res
			.cookie("token", token, {
				httpOnly: true,
				secure: true,
			})
			.sendStatus(202);
	}),
];

exports.localLogin_POST = [
	body("username")
		.escape()
		.custom(async (v) => {
			const dbCheck = await sql`select 1 from Users where username = ${v}`;
			if (!dbCheck.count) {
				throw new Error("This username does not exist.");
			} else {
				return true;
			}
		})
		.isLength({ min: 4, max: 13 })
		.withMessage("Invalid length")
		.matches(/^[a-zA-Z0-9_-]+$/)
		.withMessage("Invalid character(s)"),
	body("password")
		.escape()
		.isLength({ min: 6, max: 15 })
		.withMessage("Invalid length")
		.matches(/^[a-zA-Z0-9_-]+$/)
		.withMessage("Invalid character(s)"),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array());
		}

		const { username, password } = req.body;
		const dbResponse =
			await sql`select password from Users where username = ${username}`;
		const encryptedPassword = dbResponse[0].password;
		const hashResult = await bcrypt.compare(password, encryptedPassword);
		if (hashResult) {
			const response =
				await sql`select id, username, created from Users where username = ${username}`;
			const token = jwt.sign(response[0], PRIVATE_KEY, { expiresIn: "2 day" });
			console.log(token);
			return res
				.cookie("token", token, {
					httpOnly: true,
					secure: true,
				})
				.sendStatus(202);
		} else {
			return res.status(401).send({ error: "Wrong password" });
		}
	}),
];

exports.logout_GET = asyncHandler((req: Request, res: Response) => {
	res.clearCookie("token").sendStatus(200);
});
