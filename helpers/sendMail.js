import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = (req, res, order) => {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_SECRET_KEY,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN,
      },
    });
  
    const { value } = req.body;
  
    transporter.sendMail(
      {
        from: "krismat1121@gmail.com",
        to: "matyga.krzysztof@gmail.com",
        subject: "Order Status",
        html: `<h1>Hi ${order?.buyer?.name} your order status has changed to ${order?.status}</h1>`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.json({ value });
          console.log("Email sent: " + info.response);
        }
      }
    );
  };