const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")

const user_model = require("../../../models/user")

const validation = require("../../../middleware/validation")

router.use(
    validation({
        "resetid": {
            type: "string"
        },
        "newpassword": {
            type: "string"
        }
    }, false)
)

function validate_password(password) {
    if (password.length <= 8) {
        return "Password must be at least 8 characters long."
    } else if (password.length >= 150) {
        return "Password cannot be longer than 150 characters."
    }

    return null
}

router.post("/", async (req, res) => {
    try {
        let errors = {}

        const user = await user_model.findOne({ resetId: req.body.resetId })

        if (user === null) {
            res.status(500).json({
                error: "Invalid Id."
            })
        } else if (user.resetIdValidUntil > Date.now()) {
            res.status(500).json({
                error: "Reset link expired."
            })
        } else {
            const passwordValidation = validate_password(req.body.newPassword)
    
            if (passwordValidation) {
                errors.password = passwordValidation
            }

            if (Object.keys(errors).length === 0) {
                const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)

                user.password = hashedPassword
                user.resetId = ""
                user.sessions = "{}"

                user.save()

                res.status(200).json({
                    message: "Password changed."
                })
            } else {
                 res.status(500).json({
                     error: errors
                })
            }
        }
    } catch {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})

module.exports = router