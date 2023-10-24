const validate = (data, any) => {
    return (req, res, next) => {
        let validated = false
        let correct = 0

        const keys = Object.keys(data)

        for (let i = 0; i < keys.length; i++) {
            const item = keys[i]

            if (typeof(req.body[item]) != data[item].type) {
                validated = false
            } else {
                correct ++
            }
        }

        if (correct === keys.length || correct > 0 && any) {
            next()
        } else {
            res.status(406).json({
                error: "Malformed request."
            })
        }
    }
}

module.exports = validate