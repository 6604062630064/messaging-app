import express, { Request, Response } from "express";
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/loggedin", async (req: Request, res: Response) => {
	res.send("To be implemented");
});

router.get("/google", authController.googleAuth_GET);

module.exports = router;
