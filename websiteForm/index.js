const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const config = require("./config.js");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport(`smtps://${encodeURIComponent(config.email)}:${encodeURIComponent(config.password)}@${config.host}`);

app.post("/websiteForm/send.html", (req, res) => {
    //get location from ip
    fetch(
        "https://api.ip2location.io/?" +
            new URLSearchParams({
                key: config.locationApi,
                ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            })
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            //send email
            transporter.sendMail({ from: config.email, to: config.email, subject: "Website Form", text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}\nLocation: ${data.city_name}, ${data.country_code}` }, (err) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.listen(port, () => {
    console.log(`Website form app listening on port ${port}`);
});
