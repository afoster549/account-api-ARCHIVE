const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

router.post("/", async (req, res) => {
    if (typeof(req.body.resetId) != "string") {
        res.status(406).json({
            error: "No Id."
        })
    } else {
        const user = await user_model.findOne({ resetId: req.body.resetId })

        if (user) {
            res.status(200).json({
                username: user.username,
                picon: "https://cdn.afoster.uk/images/users/avatar/defualt.png"
            })
        } else {
            res.status(406).json({
                error: "Invalid Id."
            })
        }
    }
})

module.exports = router