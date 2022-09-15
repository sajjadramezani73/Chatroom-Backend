const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user-routes.js')

const app = express()
app.use(bodyParser.json())

app.use('/api/user', userRoutes)


mongoose.connect('mongodb://127.0.0.1:27017/chatroom')
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err);
    })