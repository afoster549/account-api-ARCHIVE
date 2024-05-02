const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")

const express = require("express")
const app = express()

// const { rateLimit } = require("express-rate-limit")

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     standardHeaders: "draft-7",
//     legacyHeaders: false
// })

const cors = require("cors")

app.use(cors({ "origin": "*" }))
app.use(express.json())

const port = 8080
let status = 200
let statusMessage = "API active"

// DB

mongoose.connect(`mongodb+srv://Admin:${process.env.dbpassword}@cluster0.egz3m.mongodb.net/site?retryWrites=true&w=majority`).catch(error => console.log(error))

// Root

app.get("/", (req, res) => {
    res.status(status).send(statusMessage)
})

// Register

const register_route = require("./routes/v1/account/register")
app.use("/v1/account/register", register_route)

// Login

const login_route = require("./routes/v1/account/login")
app.use("/v1/account/login", login_route)

// Auth

const auth_route = require("./routes/v1/account/auth")
app.use("/v1/account/auth", auth_route)

// Gen Password Reset Link

const send_password_reset_link_route = require("./routes/v1/account/sendresetlink")
app.use("/v1/account/sendresetlink", send_password_reset_link_route)

// Get Password Reset Link

const get_password_reset_link_route = require("./routes/v1/account/getresetlink")
app.use("/v1/account/getpasswordresetlink", get_password_reset_link_route)

// Reset Password

const reset_password_route = require("./routes/v1/account/resetpassword")
app.use("/v1/account/resetpassword", reset_password_route)

// Sessions [auth protected]

const sessions_route = require("./routes/v1/account/sessions")
app.use("/v1/account/sessions", sessions_route)

// Update Avatar [auth protected]

const updateavatar_route = require("./routes/v1/account/profile/updateavatar")
app.use("/v1/account/profile/updateavatar", updateavatar_route)

// Update Nickname [auth protected]

const updatenickname_route = require("./routes/v1/account/profile/updatenickname")
app.use("/v1/account/profile/updatenickname", updatenickname_route)

// Update Username [auth protected]

const updateusername_route = require("./routes/v1/account/profile/updateusername")
app.use("/v1/account/profile/updateusername", updateusername_route)

// Sign out other session [auth protected]

const signoutsession_route = require("./routes/v1/account/signoutsession")
app.use("/v1/account/signoutsession", signoutsession_route)

// Sign out all other sessions [auth protected]

const signoutothersessions_route = require("./routes/v1/account/signoutothersessions")
app.use("/v1/account/signoutothersessions", signoutothersessions_route)

// Profile

const profile_route = require("./routes/v1/users/profile")
app.use("/v1/users/profile", profile_route)

// Search

const search_route = require("./routes/v1/users/search")
app.use("/v1/users/search", search_route)

app.listen(port, () => {
    console.log(`Listening on port ${port} • http://localhost:${port}`)
})