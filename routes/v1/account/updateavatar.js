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
        },
        "avatarurl": {
            type: "string"
        }
    }, false)
)

router.post("/", async (req, res) => {
    try {
        if (!req.body.avatarUrl.startsWith("https://cdn.afoster.uk/images/users/avatar/")) {
            res.status(400).json({
                error: "Invalid Avatar Url."
            })
        } else {
            const data = await user_model.findOne({ token: req.body.token })

            const sessions = JSON.parse(data.sessions)

            if (sessions[req.body.session]) {
                data.avatarUrl = req.body.avatarUrl

                data.save()
            } else {
                res.status(500).json({
                    error: "Something went wrong."
                })
            }

            res.status(200).json({
                data: "Updated avatar."
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router