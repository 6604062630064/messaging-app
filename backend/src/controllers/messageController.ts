import { body, cookie, oneOf, validationResult } from "express-validator";
import { Request, Response } from "express";
import sql from "../db";
import axios from "axios";
import { request } from "http";
const {
	SERVER_URL,
	CLIENT_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PRIVATE_KEY,
} = process.env;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.message_GET = [
	cookie("token").exists().withMessage("User is not logged in"),
	body("recipient").isNumeric().withMessage("Invalid value"),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array({ onlyFirstError: true }));
		}

		const token = req.cookies.token;
		const recipientID = req.body.recipient;
		try {
			const userData = jwt.verify(token, PRIVATE_KEY);
			const dbResponse =
				await sql`select * from uMessages where sender = ${userData.id} and recipient = ${recipientID} order by created asc`;

			res.status(200).json(dbResponse);
		} catch (err) {
			console.log(err);
			res.sendStatus(401);
		}
	}),
];
