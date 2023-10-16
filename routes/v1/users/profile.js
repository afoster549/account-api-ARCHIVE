const express = require("express")
const router = express.Router()

const user_model = require("../../models/user")

router.post("/", async (req, res) => {
    try {
        if (typeof(req.body.userId) != "number" && typeof(req.body.username) != "string") {
            res.status(406).json({
                error: "No id or username provided."
            })
        } else {
            let user

            if (typeof(req.body.username) != "string") {
                user = await user_model.findOne({ lower_username: req.body.username.toLowerCase() })
            } else {
                user = await user_model.findOne({ id: req.body.id.toLowerCase() })
            }

            res.status(200).json({
                data: {
                    nickname: user.nickname,
                    username: user.username,
                    badges: user.badges,
                    avatarUrl: user.avatarUrl
                }
            })
        }
    } catch {
        res.status(500).json({
            message: "Something went wrong."
        })
    }
})

module.exports = router