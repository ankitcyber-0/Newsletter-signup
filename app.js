require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", async (req, res) => {
    const { fname, lname, email } = req.body;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const url = `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`;

    try {
        const response = await axios.post(url, data, {
            auth: {
                username: "anystring",
                password: process.env.MAILCHIMP_API_KEY
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Status Code:", response.status);
        console.log(response.data);

        res.sendFile(path.join(__dirname, "success.html"));
    } catch (error) {
        if (error.response) {
            console.log("Status Code:", error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.sendFile(path.join(__dirname, "failure.html"));
    }
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});