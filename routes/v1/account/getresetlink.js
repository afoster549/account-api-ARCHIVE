const express = require("express")
const router = express.Router()

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "resetid": {
            type: "string"
        }
    }, false)
)

router.post("/", async (req, res) => {
    try {
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
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router