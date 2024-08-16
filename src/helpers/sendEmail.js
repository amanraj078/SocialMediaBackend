const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (email, name) => {
    try {
        const info = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcom to our app", // Subject line
            text: `Hi ${name}, Thanks for signup`, // plain text body
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            
            <body>
                <h1>Hi, ${name}</h1>
                <p>welcome to our application.</p> <br> <br>
                <p>Thanks for sign up with us.</p> <br> <br>
                <p>With regards</p>
                <p>Rungta team</p>
            </body>
            
            </html>`, // html body
        };

        transporter.sendMail(info, function (error, info) {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendMail;
