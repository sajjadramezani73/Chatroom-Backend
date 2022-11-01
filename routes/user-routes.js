const express = require('express')
const router = express()

const userRoutes = require('../controllers/user-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/', userRoutes.getUsers)

router.post('/singup', userRoutes.singup)

router.post('/login', userRoutes.login)

router.post('/update', fileUpload.single('avatar'), userRoutes.updeteUser)

module.exports = router