class validate {
    static data(dat) {
        return (req, res, next) => {
            console.log(this.data)

            next()
        }
    }
}

module.exports = validate