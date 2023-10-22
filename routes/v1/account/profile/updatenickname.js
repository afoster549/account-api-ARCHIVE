const express = require("express")
const router = express.Router()
const auth_mid = require("../../../middleware/auth")

const user_model = require("../../../../models/user")

const validation = require("../../../../middleware/validation")

router.use(
    validation({
        "token": {
            type: "string"
        },
        "session": {
            type: "string"
        },
        "nickname": {
            type: "string"
        }
    }, false)
)

router.use(auth_mid)

router.post("/", async (req, res) => {
    try {
        if (!req.body.avatarUrl.startsWith("https://cdn.afoster.uk/images/users/avatar/")) {
            res.status(400).json({
                error: "Invalid Avatar Url."
            })
        } else {
            const data = await user_model.findOne({ token: req.body.token })

            const comparison = await bcrypt.compare(req.body.password, data.password)

            if (comparison) {
                data.nickname = req.body.nickname

                try {
                    const error = data.validateSync()

                    if (error.errors.nickname) {
                        res.status(401).json({
                            error: error.errors.nickname.properties.message
                        })
                    }
                } catch {
                    data.save()
        
                    res.status(200).json({
                        data: "Updated nickname."
                    })
                }
            } else {
                res.status(401).json({
                    error: "Incorrect password."
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