const express = require("express")
const router = express.Router()
const auth_mid = require("../../middleware/auth")

const bcrypt = require("bcrypt")

const user_model = require("../../models/user")

router.use(auth_mid)

router.post("/", async (req, res) => {
    try {
        res.status(200).send({
            message: "Test"
        })
    } catch {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

module.exports = router