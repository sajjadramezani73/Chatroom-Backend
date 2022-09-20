const User = require('../model/user')
const HttpError = require('../model/http-error')
const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {
    let users
    try {
        users = await User.find()
    } catch (err) {
        const error = new HttpError('Getting user faild', 500)
        return next(error)
    }
    res.json({ users: users.map(user => user.toObject({ gettesr: true })) })
}

const singup = async (req, res, next) => {
    const { username, password, gender } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ username: username })
    } catch (err) {
        const error = new HttpError('singup faild !', 500)
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError('user exist !', 422)
        return next(error)
    }

    let hashPassword
    try {
        hashPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError('singup faild !', 500)
        return next(error)
    }

    const createUser = new User({
        username: username,
        password: hashPassword,
        avatar: 'user',
        gender: gender
    })

    try {
        await createUser.save()
    } catch (err) {
        const error = new HttpError('singup faild !', 500)
        return next(error)
    }

    res.status(201).json({ user: createUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
    const { username, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ username: username })
    } catch (err) {
        const error = new HttpError('login faild !', 500)
        return next(error)
    }

    if (!existingUser) {
        const error = new HttpError('user is not exist', 422)
        return next(error)
    }

    let validPassword = false
    try {
        validPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError('login faild !', 500)
        return next(error)
    }

    if (!validPassword) {
        const error = new HttpError('password is not valid', 422)
        return next(error)
    }

    res.json({ user: existingUser })
}

exports.getUsers = getUsers
exports.singup = singup
exports.login = login
