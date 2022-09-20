const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    gender: { type: String, required: true },
})

module.exports = mongoose.model('User', userSchema)