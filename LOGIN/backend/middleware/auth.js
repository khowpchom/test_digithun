const jwt = require('jsonwebtoken')
const secretKey = require('../config/auth.config')

module.exports = { 
    authenticateToken: (req, res, next) => {
        const bearerHeader = req.headers["authorization"]
        if(typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ")
            const baererToken = bearer[1]
            req.token = baererToken
            jwt.verify(req.token, secretKey.secret, (error, data) => {
                if(error) {
                    res.status(403).send()
                }
                else {
                    req.user = data
                    next()
                }
            })
        }
        else {
            res.status(401).send()
        }
    }
}