import express, { Request, Response } from "express";
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.onlineUsers_GET);

module.exports = router;
