import { Request, Response } from "express";
import { cookie, validationResult } from "express-validator";
import sql from "../db";
const { PRIVATE_KEY } = process.env;
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.onlineUsers_GET = [
	cookie("token").exists().withMessage("User is logged in"),
	asyncHandler(async (req: Request, res: Response) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(401).json(result.array());
		}

		const token: string = req.cookies.token;
		try {
			const data = jwt.verify(token, PRIVATE_KEY);
			const dbResponse =
				await sql`select id, username, avatar from Users where id != ${data.id}`;
			console.log(data);
			return res.status(200).json(dbResponse);
		} catch (err) {
			return res.sendStatus(401);
		}
	}),
];
