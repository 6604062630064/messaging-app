require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/authRouter");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRouter);
app.get("/", (req: Request, res: Response) => {
	res.send("Typescript");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
