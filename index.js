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

mongoose.connect("mongodb+srv://Admin:TJ8JKjnFHWq1ErpK@cluster0.egz3m.mongodb.net/site?retryWrites=true&w=majority").catch(error => handleError(error))

// Root

app.get("/", (req, res) => {
    res.status(status).send(statusMessage)
})

// Register

const register_route = require("./routes/v1/accounts/register")
app.use("/v1/accounts/register", register_route)

// Login

const login_route = require("./routes/v1/accounts/login")
app.use("/v1/accounts/login", login_route)

// Auth

const auth_route = require("./routes/v1/accounts/auth")
app.use("/v1/accounts/auth", auth_route)

// Gen Password Reset Link

const send_password_reset_link_route = require("./routes/v1/accounts/sendresetlink")
app.use("/v1/accounts/sendresetlink", send_password_reset_link_route)

// Get Password Reset Link

const get_password_reset_link_route = require("./routes/v1/accounts/getresetlink")
app.use("/v1/accounts/getpasswordresetlink", get_password_reset_link_route)

// Reset Password

const reset_password_route = require("./routes/v1/accounts/resetpassword")
app.use("/v1/accounts/resetpassword", reset_password_route)

// Sessions 

const sessions_route = require("./routes/v1/accounts/sessions")
app.use("/v1/accounts/sessions", sessions_route)

app.listen(port, () => {
    console.log(`Listening on port ${port} • http://localhost:${port}`)
})