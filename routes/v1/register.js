const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")

const user_model = require("../../models/user")

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function gen_token() {
    let start = ""
    const mid = Buffer.from(Date.now().toString()).toString("base64")
    let end = ""
    
    for (let i = 0; i < 50; i++) {
        start += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    for (let i = 0; i < 50; i++) {
        end += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return `${start}.${mid}.${end}`
}

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
        if (typeof(req.body.username) === "undefined" || typeof(req.body.password) === "undefined" || typeof(req.body.email) === "undefined") {
            res.status(400).json({
                error: "Invalid JSON format."
            })
        } else {
            let errors = {}
    
            const passwordValidation = validate_password(req.body.password)
    
            if (passwordValidation) {
                errors.password = passwordValidation
            }
            
            try {
                const token = gen_token()
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
                const doc = new user_model({
                    userId: await user_model.count({}),
                    token: token,
                    username: req.body.username,
                    lower_username: req.body.username.toLowerCase(),
                    nickname: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                    regip: req.headers["x-forwarded-for"] || req.socket.remoteAddress
                })
    
                try {
                    const error = doc.validateSync()
    
                    if (error.errors.username) {
                        errors.username = error.errors.username.properties.message
                    }
                    if (error.errors.email) {
                        errors.email = error.errors.email.properties.message
                    }
    
                    res.status(500).json({
                        error: errors
                    })
                } catch {
                    if (Object.keys(errors).length === 0) {
                        doc.save()
    
                        res.status(201).json({
                            message: "Account created."
                        })
                    } else {
                        res.status(400).json({
                            error: errors
                        })
                    }
                }
            } catch {
                res.status(500).json({
                    error: "Something went wrong."
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