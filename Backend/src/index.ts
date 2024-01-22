import express from "express";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./model/User";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = "secret123";

const app = express();
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

//connection to database

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ msg: "Hello World" });
});

//setup logout.
app.get("/logout", (req: Request, res: Response) => {
    res.cookie("token", "").json({});
});

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            password: hashPassword,
            email,
        });
        const userInfo = await user.save();

        const token = jwt.sign(
            { email: userInfo.email, id: userInfo._id },
            secret
        );

        res.status(200)
            .cookie("token", token)
            .json({ _id: userInfo._id, email: userInfo.email });
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get("/user", async (req: Request, res: Response) => {
    try {
        const payload = jwt.verify(req.cookies.token, secret) as JwtPayload;
        const user = await User.findById(payload.id);
        if (!user) {
            res.status(404).json({ msg: "User Not Found" });
        }
        res.status(200).json({ email: payload.email });
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        const okPass = bcrypt.compareSync(password, user?.password);

        if (!okPass) {
            return res.status(401).json({ mag: "Unauthorized" });
        }

        const token = jwt.sign({ email: user?.email, id: user?._id }, secret);

        res.status(200)
            .cookie("token", token)
            .json({ _id: user._id, email: user.email });
    } catch (error) {
        res.status(500).json({ error });
    }
});
//start function
const start = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/auth");
        console.log("connnect to db");

        app.listen(port, () => {
            console.log(`Server has started at port no ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
