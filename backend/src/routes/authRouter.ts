import express, { Request, Response } from "express";
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/loggedin", authController.checkLogin_GET);

router.get("/google", authController.googleAuth_GET);

module.exports = router;
