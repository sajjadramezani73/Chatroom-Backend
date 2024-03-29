const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: Array, default: [] },
    gender: { type: String, required: true },
    bio: { type: String }
})

module.exports = mongoose.model('User', userSchema)