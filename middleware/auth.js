const user_model = require("../models/user")

const auth = async function(req, res, next) {
    if (typeof(req.body.session) === "string" || typeof(req.body.token) === "string") {
        const data = await user_model.findOne({ token: Buffer.from(req.body.token).toString("utf-8") })

        if (data) {
            const sessions = JSON.parse(data.sessions)
            const session = sessions[req.body.session]

            if (session) {
                if (session.expires <= Date.now()) {
                    const sessions = JSON.parse(data.sessions)

                    delete sessions[req.body.session]

                    data.sessions = JSON.stringify(sessions)

                    data.save()

                    res.status(401).send({
                        error: "Session expired"
                    })
                } else {
                    next()
                }
            } else {
                res.status(401).send({
                    error: "Not authenticated"
                })
            }
        } else {
            res.status(500).send({
                error: "Something went wrong"
            })
        }
    } else {
        res.status(400).send({
            error: "Malformed request"
        })
    }
}

module.exports = auth