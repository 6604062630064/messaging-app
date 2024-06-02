import express, { Request, Response } from "express";
const messageController = require("../controllers/messageController");
const router = express.Router();

router.get("/", messageController.message_GET);

router.post("/", (req: Request, res: Response) => {
	res.send("To be implemented");
});
module.exports = router;
