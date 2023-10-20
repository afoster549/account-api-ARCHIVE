const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const router = express.Router()

const nodemailer = require("nodemailer")

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "email": {
            type: "string"
        }
    }, false)
)

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function gen_password_reset_id() {
    let id = ""

    for (let i = 0; i < 50; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return id += Buffer.from(Date.now().toString()).toString("base64")
}

router.post("/", async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "yahoo",
            auth: {
                user: "afoster.uk@yahoo.com",
                pass: process.env.emailpassword
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const passwordResetId = gen_password_reset_id()

        const mail_config = {
            from: "noreply@afoster.uk",
            to: req.body.email,
            subject: "Password reset",
            html:
            `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <p>A password reset has been requested for you're account. You can reset you're password <a href="https://accounts.123game.dev/resetpassword/?r=${passwordResetId}">here</a>. If you didn't request this then you can safely ignore this email. Originated from ${req.headers["x-forwarded-for"] || req.socket.remoteAddress}</p>
            </body>
            </html>`
        }

        const user = await user_model.findOne({ email: req.body.email })

        if (user) {
            transporter.sendMail(mail_config, (error, info) => {
                if (error) {
                    console.log(error)

                    res.status(500).json({
                        error: "Something went wrong."
                    })
                } else {
                    user.resetId = passwordResetId

                    user.save()

                    res.status(200).json({
                        message: "An email will be sent if an account was found."
                    })
                }
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router