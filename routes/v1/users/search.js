const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

router.get("/", async (req, res) => {
    try {
        const data = await user_model.find({ "lower_username": {"$regex": `^${req.query.username.toLowerCase()}`} }).limit(10)

        if (data) {
            let stripedData = []

            data.forEach(user => {
                stripedData.push({
                    id: user.userId,
                    username: user.username,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl
                })
            })

            res.status(200).json({
                data: stripedData
            })
        } else {
            res.status(200).json({
                message: "No users found."
            })
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router