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
const body_parser_1 = __importDefault(require("body-parser"));
const tableify_1 = __importDefault(require("tableify"));
const express_nobots_1 = __importDefault(require("express-nobots"));
require("dotenv").config();
const sendEmail_1 = require("./utils/sendEmail");
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use(express_nobots_1.default());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.post("/send-infos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const values = req.body;
    yield sendEmail_1.sendEmail(process.env.EMAIL_ADDRESS, `${tableify_1.default(values)}`);
    res.send(Promise.resolve());
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../build")));
app.get("/*", (_, res) => {
    res.sendFile(path_1.default.join(__dirname, "../build", "index.html"));
});
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map