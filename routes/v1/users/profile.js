const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "userid": {
            type: "number"
        },
        "username": {
            type: "string"
        }
    }, true)
)

router.post("/", async (req, res) => {
    try {
        if (typeof (req.body.username) === "string") {
            user = await user_model.findOne({ lower_username: req.body.username.toLowerCase() })
        } else {
            user = await user_model.findOne({ userId: req.body.userid })
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