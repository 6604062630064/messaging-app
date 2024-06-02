import { body, cookie, validationResult } from "express-validator";
import { Request, Response } from "express";
import sql from "../db";
const { PRIVATE_KEY } = process.env;
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
			res.sendStatus(401);
		}
	}),
];

exports.message_POST = [
	cookie("token").exists().withMessage("User is not logged in"),
	body("recipient").isNumeric().withMessage("Invalid value"),
	body("body")
		.trim()
		.isLength({ min: 1, max: 1000 })
		.withMessage("Too few or too many characters"),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array({ onlyFirstError: true }));
		}

		const token = req.cookies.token;
		const { recipient, body } = req.body;

		try {
			const userData = jwt.verify(token, PRIVATE_KEY);
			await sql`insert into uMessages ${sql({
				body: body,
				sender: userData.id,
				recipient: recipient,
				created: Date.now(),
			})}`;

			return res.sendStatus(200);
		} catch (err) {
			return res.sendStatus(401);
		}
	}),
];
