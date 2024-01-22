"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./model/User"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "secret123";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 3000;
//connection to database
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Hello World" });
});
//setup logout.
app.get("/logout", (req, res) => {
    res.cookie("token", "").json({});
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hashPassword = bcrypt_1.default.hashSync(password, 10);
        const user = new User_1.default({
            password: hashPassword,
            email,
        });
        const userInfo = yield user.save();
        const token = jsonwebtoken_1.default.sign({ email: userInfo.email, id: userInfo._id }, secret);
        res.status(200)
            .cookie("token", token)
            .json({ _id: userInfo._id, email: userInfo.email });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jsonwebtoken_1.default.verify(req.cookies.token, secret);
        const user = yield User_1.default.findById(payload.id);
        if (!user) {
            res.status(404).json({ msg: "User Not Found" });
        }
        res.status(200).json({ email: payload.email });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }
        const okPass = bcrypt_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
        if (!okPass) {
            return res.status(401).json({ mag: "Unauthorized" });
        }
        const token = jsonwebtoken_1.default.sign({ email: user === null || user === void 0 ? void 0 : user.email, id: user === null || user === void 0 ? void 0 : user._id }, secret);
        res.status(200)
            .cookie("token", token)
            .json({ _id: user._id, email: user.email });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
//start function
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb://127.0.0.1:27017/auth");
        console.log("connnect to db");
        app.listen(port, () => {
            console.log(`Server has started at port no ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=index.js.map