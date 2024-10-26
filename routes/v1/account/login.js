const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "username": {
            type: "string"
        },
        "password": {
            type: "string"
        },
        "os": {
            type: "string"
        },
        "platform": {
            type: "string"
        }
    }, false)
)

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function gen_sessionid() {
    const start = Buffer.from(Date.now().toString()).toString("base64")
    let end = ""

    for (let i = 0; i < 25; i++) {
        end += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return `${start}${end}`
}

router.post("/", async (req, res) => {
    try {
        const user = await user_model.findOne({ username: req.body.username })

        if (user) {
            try {
                const comparison = await bcrypt.compare(req.body.password, user.password)

                if (comparison && ["Windows", "Android", "MacOS", "iOS", "Linux", "UNIX"].includes(req.body.os) && ["Edge", "Internet Explorer", "Firefox", "Opera", "Safari", "Chrome"].includes(req.body.platform)) {
                    const sessions = JSON.parse(user.sessions)

                    if (Object.keys(sessions).length >= 10) {
                        res.status(406).send({
                            message: "Too many sessions."
                        })
                    } else {
                        const sessionId = gen_sessionid()

                        sessions[sessionId] = {
                            id: Object.keys(sessions).length,
                            os: req.body.os,
                            platform: req.body.platform,
                            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                            login: Date.now(),
                            expires: Date.now() + 15778458
                        }

                        user.sessions = JSON.stringify(sessions)
                        user.save()

                        res.status(200).json({
                            token: user.token,
                            session: sessionId
                        })
                    }
                } else {
                    res.status(401).json({
                        error: "Password or username is incorrect."
                    })
                }
            } catch {
                res.status(500).json({
                    error: "Something went wrong."
                })
            }
        } else {
            res.status(404).json({
                error: "Username not found."
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router