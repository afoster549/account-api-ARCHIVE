const express = require("express")
const router = express.Router()
const auth_mid = require("../../../middleware/auth")

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "token": {
            type: "string"
        },
        "session": {
            type: "string"
        },
        "logout": {
            type: "string"
        }
    }, false)
)

router.use(auth_mid)

router.post("/", async (req, res) => {
    try {
        const data = await user_model.findOne({ token: req.body.token })

        const sessions = JSON.parse(data.sessions)

        if (sessions[req.body.logout]) {
            sessions.remove(req.body.logout)
        }

        data.sessions = JSON.stringify(sessions)

        data.save()

        res.status(200).json({
            message: "Session signed out."
        })
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router