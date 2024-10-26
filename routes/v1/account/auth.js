const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "token": {
            type: "string"
        },
        "session": {
            type: "string"
        }
    }, false)
)

router.post("/", async (req, res) => {
    try {
        const data  = await user_model.findOne({ token: req.body.token })

        if (data) {
            const session = JSON.parse(data.sessions)[req.body.session]

            if (typeof(session) === "undefined") {
                res.status(500).json({
                    error: "Something went wrong."
                })
            } else {
                if (session.expires <= Date.now()) {
                    const sessions = JSON.parse(data.sessions)

                    delete sessions[req.body.session]

                    data.sessions = JSON.stringify(sessions)

                    data.save()

                    res.status(401).send({
                        error: "Session expired."
                    })
                } else {
                    const reqIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress

                    if (session.ip != reqIp) {
                        session.ip = reqIp

                        session.save((error) => {
                            if (error) {
                                console.log(error)
                                
                                res.status(401).json({
                                    error: error
                                })
                            }
                        })
                    }

                    if (req.body.senddata === true) {
                        res.status(200).json({
                            data: {
                                userid: data.userId,
                                username: data.username,
                                nickname: data.nickname
                            }
                        })
                    } else {
                        res.status(200)
                    }
                }
            }
        } else {
            res.status(500).json({
                error: "Something went wrong."
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router