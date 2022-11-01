const fs = require('fs')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user-routes')
const configRoutes = require('./routes/config-routes')

const app = express()
app.use(bodyParser.json())
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
})

app.use('/api/users', userRoutes)
app.use('/api/application', configRoutes)

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err)
        })
    }
    if (res.headerSet) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'Error' })
})

mongoose.connect('mongodb://127.0.0.1:27017/chatroom')
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err);
    })