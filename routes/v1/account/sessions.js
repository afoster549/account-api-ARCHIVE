const express = require("express")
const router = express.Router()
const auth_mid = require("../../../middleware/auth")

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "token": {
            type: "string"
        }
    }, false)
)

router.use(auth_mid)

router.post("/", async (req, res) => {
    try {
        const data = await user_model.findOne({ token: req.body.token })

        const sessions = JSON.parse(data.sessions)

        res.status(200).json({
            data: sessions
        })
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router