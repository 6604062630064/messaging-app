import express, { Request, Response } from "express";
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/loggedin", authController.checkLogin_GET);
router.get("/google", authController.googleAuth_GET);

router.post("/signup", authController.localSignup_POST);
router.post("/login", authController.localLogin_POST);
module.exports = router;
