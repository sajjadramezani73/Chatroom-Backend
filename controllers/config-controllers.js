const jwt = require('jsonwebtoken')

const getIndex = async (req, res, next) => {
    const reqToken = req.headers.authorization

    let userValid
    if (reqToken == undefined) {
        userValid = false
    } else {
        const token = reqToken.split(' ')[1]
        const validToken = jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                userValid = false
            }
            else {
                userValid = true
            }
            next()
        })
    }
    res.json({ userValid: userValid })

}

exports.getIndex = getIndex