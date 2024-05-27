require("dotenv").config();
import express, { Request, Response } from "express";
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/authRouter");
const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use("/auth", authRouter);
app.get("/", (req: Request, res: Response) => {
	res.send("Typescript");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
