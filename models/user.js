const mongoose = require("mongoose")
const schema = mongoose.Schema

const user_schema = new schema({
    userId: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, "Username required."],
        minlength: [2, "Username must be at least 2 charcters long."],
        maxlength: [15, "Username cannot be longer than 15 characters."],
        validate: {
            validator: function(v) {
                const validRegex = /^[a-zA-Z0-9_]*$/

                if (v.match(validRegex)) {
                    let valid = true
                    let total = 0

                    for (let i = 0; i < v.length; i ++) {
                        if (v[i] === "_" && total < 1 && i > 0 && i < v.length - 1) {
                            total ++
                        } else if (v[i] === "_" && (total > 0 || (i === 0 || i === v.length - 1))) {
                            valid = false
                        }
                    }

                    return valid
                } else {
                    return false
                }
            },
            message: "Username can only contain letters a-z, numbers 0-9 and one underscore in the middle."
        }
    },
    lower_username: {
        type: String,
        required: false
    },
    nickname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, "Password required."],
        minlength: [8, "Password must be at least 8 charcters long."],
        maxlength: [150, "Password too long."]
    },
    email: {
        type: String,
        required: [true, "Email required."],
        validate: {
            validator: function(v) {
                const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                
                if (v.match(validRegex)) {
                    return true
                } else {
                    return false
                }
            },
            message: "Invalid email address."
        },
        minlength: 5
    },
    avatarUrl: {
        type: String,
        required: false,
        default: "https://cdn.afoster.uk/images/users/avatar/defualt.png"
    },
    regip: {
        type: String,
        required: false
    },
    adminlevel: {
        type: Number,
        required: false,
        default: -1,
        min: -1
    },
    badges: {
        type: Array,
        required: false,
        default: []
    },
    banned: {
        type: Boolean,
        required: false,
        default: false
    },
    warnings: {
        type: Array,
        required: false,
        default: []
    },
    sessions: {
        type: String,
        required: false,
        default: "{}"
    },
    resetId: {
        type: String,
        required: false,
        default: ""
    }
}, {
    timestamps: true
})

const user = mongoose.model("users", user_schema)
module.exports = user