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
        }
    }, false)
)

router.use(auth_mid)

router.post("/", async (req, res) => {
    try {
        const data = await user_model.findOne({ token: req.body.token })

        const sessions = JSON.parse(data.sessions)

        const newSessions = {}
        newSessions[req.body.session] = sessions[req.body.session]

        data.sessions = JSON.stringify(newSessions)

        data.save()

        res.status(200).json({
            message: "Sessions signed out."
        })
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router