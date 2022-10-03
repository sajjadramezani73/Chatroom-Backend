const express = require('express')
const router = express()

const userRoutes = require('../controllers/user-controllers')

router.get('/', userRoutes.getUsers)

router.post('/singup', userRoutes.singup)

router.post('/login', userRoutes.login)

module.exports = router