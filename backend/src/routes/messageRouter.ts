import express, { Request, Response } from "express";
const messageController = require("../controllers/messageController");
const router = express.Router();

router.get("/", messageController.message_GET);

router.post("/", messageController.message_POST);
module.exports = router;
