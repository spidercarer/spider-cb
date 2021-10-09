import nodemailer from "nodemailer";

export const sendEmail = async (to: string, html: string, subject: string) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Fred Foo 👻" ${to}`,
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};
