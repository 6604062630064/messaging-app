import { Request, Response } from "express";
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
	return res.cookie("google-token", token).sendStatus(202);
});
