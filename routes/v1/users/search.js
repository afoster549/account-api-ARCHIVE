const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "query": {
            type: "string"
        }
    }, true)
)

router.post("/", async (req, res) => {
    // try {
        const data = await user_model.find({ "username": {"$regex": `^${req.body.query}`} }).setLimit(10)

        if (data) {
            let stripedData = []

            data.forEach(user => {
                stripedData.push({
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
    // } catch {
    //     res.status(500).json({
    //         error: "Something went wrong."
    //     })
    // }
})

module.exports = router