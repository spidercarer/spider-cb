import express from "express";
import bodyParser from "body-parser";
import tableify from "tableify";
import noBots from "express-nobots";

require("dotenv").config();

import { sendEmail } from "./utils/sendEmail";
import path from "path";

const app = express();

const port = process.env.PORT || 5000;

app.use(noBots());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.post("/send-infos", async (req, res) => {
  const values = req.body;
  await sendEmail(process.env.EMAIL_ADDRESS!, `${tableify(values)}`);
  res.send(Promise.resolve());
});

app.use(express.static(path.join(__dirname, "../build")));
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
