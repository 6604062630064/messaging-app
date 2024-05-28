import { Request, Response } from "express";
import { check, cookie, oneOf, validationResult } from "express-validator";
import sql from "../db";
import axios from "axios";
const asyncHandler = require("express-async-handler");
const queryString = require("query-string");
const jwt = require("jsonwebtoken");

const {
	SERVER_URL,
	CLIENT_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PRIVATE_KEY,
} = process.env;
const redirectUrl = "/auth/google";
const getGoogleAuthURL: () => string = () => {
	const rootUrl = "https://accounts.google.com/o/oauth2/auth";

	const options = {
		redirect_uri: `${SERVER_URL}${redirectUrl}`,
		client_id: GOOGLE_CLIENT_ID,
		response_type: `code`,
		access_type: `offline`,
		prompt: "select_account",
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
	const token = jwt.sign(googleUser, PRIVATE_KEY, { expiresIn: "2 day" });
	const checkDB =
		await sql`select 1 from users where external_id = ${googleUser.id}`;
	if (!checkDB.count) {
		await sql`insert into Users ${sql({
			username: googleUser.name,
			role: "guest",
			created: Date.now(),
			avatar: googleUser.picture,
			external_type: "google",
			external_id: googleUser.id,
		})}`;
	}

	return res.cookie("google_token", token).sendStatus(202);
});

exports.checkLogin_GET = [
	oneOf([cookie("google_token").exists(), cookie("token").exists()], {
		message: "User is not logged in",
	}),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array({ onlyFirstError: true }));
		}
		const {
			google_token,
			token,
		}: { google_token: string | undefined; token: string | undefined } =
			req.cookies;

		if (google_token) {
			try {
				const googleData = jwt.verify(google_token, PRIVATE_KEY);
				const dbResponse =
					await sql`select username, role, avatar from Users where external_id = ${googleData.id}`;
				return res.status(200).json(dbResponse[0]);
			} catch (err) {
				return res.sendStatus(401);
			}
		} else if (token) {
			return res.sendStatus(200);
		}
	}),
];
