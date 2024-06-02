require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
const { CLIENT_URL } = process.env;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/authRouter");
const messageRouter = require("../src/routes/messageRouter");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 5000;
app.use(morgan("dev"));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.get("/", (req: Request, res: Response) => {
	res.send("Typescript");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
