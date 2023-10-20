const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

router.get("/", async (req, res) => {
    try {
        if (typeof (req.query.username) === "string") {
            user = await user_model.findOne({ username: req.query.username })
        } else if (req.query.userid) {
            user = await user_model.findOne({ userId: req.query.userid })
        }

        if (user) {
            res.status(200).json({
                data: {
                    nickname: user.nickname,
                    username: user.username,
                    badges: user.badges,
                    avatarUrl: user.avatarUrl
                }
            })
        } else {
            res.status(404).json({
                error: "User not found."
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router