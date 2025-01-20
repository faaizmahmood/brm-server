const jwt = require('jsonwebtoken')
require('dotenv').config();

const secreteKey = process.env.SECRETEJWTKEY


const setUser = (user) => {

    return jwt.sign(user, secreteKey)

}


const getUser = (token) => {

    return jwt.verify(token, secreteKey)

}


module.exports = { setUser, getUser }