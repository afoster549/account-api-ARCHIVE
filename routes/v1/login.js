const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")

const user_model = require("../../models/user")

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
        if (typeof(req.body.username) != "string" || typeof(req.body.password) != "string" || req.body.username.length === 0 || req.body.password.length === 0 || typeof(req.body.os) != "string" || typeof(req.body.platform) != "string") {
            res.status(406).json({
                error: "Missing data."
            })
        } else {
            const user = await user_model.findOne({ username: req.body.username })
    
            if (user) {
                try {
                    const comparison = await bcrypt.compare(req.body.password, user.password)
    
                    if (comparison && ["Windows", "Android", "MacOS", "iOS", "Android", "Linux", "UNIX"].includes(req.body.os) && ["Edge", "Internet Explorer", "Firefox", "Opera", "Safari", "Chrome"].includes(req.body.platform)) {
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
                                token: Buffer.from(user.token).toString("base64"),
                                session: Buffer.from(sessionId).toString("base64")
                            })
                        }
                    } else {
                        res.status(406).json({
                            error: "Incorrect information."
                        })
                    }
                } catch {
                    res.status(500).json({
                        error: "Something went wrong."
                    })
                }
            } else {
                res.status(404).json({
                    message: "User not found."
                })
            }
        }
    } catch {
        res.status(500).json({
            message: "Something went wrong."
        })
    }
})

module.exports = router