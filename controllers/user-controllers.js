const User = require('../model/user')
const HttpError = require('../model/http-error')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
        res.status(422).json({ success: 0, errorMessage: 'نام کاربری قبلا انتخاب شده است' })
        return next()
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
        avatar: '',
        gender: gender,
        hasAvatar: 0
    })

    try {
        await createUser.save()
    } catch (err) {
        const error = new HttpError('singup faild !', 500)
        return next(error)
    }

    let token
    try {
        token = jwt.sign(
            { userId: createUser.id, username: createUser.username },
            'secret_key',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Sing up faild.', 500)
        return next(error)
    }

    res.status(201).json({ success: 1, message: 'ثبت نام با موفقیت انجام شد' })
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
        res.status(422).json({ success: 0, errorMessage: 'کاربری با این مشخصات یافت نشد' })
        return next()
    }

    let validPassword = false
    try {
        validPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError('login faild !', 500)
        return next(error)
    }

    if (!validPassword) {
        res.status(422).json({ success: 0, errorMessage: 'رمز عبور وارد شده اشتباه است' })
        return next()
    }

    let token
    try {
        token = jwt.sign(
            { userId: existingUser.id, username: existingUser.username },
            'secret_key',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Sing up faild.', 500)
        return next(error)
    }

    res.json({
        message: 'با موفقیت وارد شدید',
        user: existingUser,
        token: token
    })
}

const updeteUser = async (req, res, next) => {
    const { id, username, gender, deleteAvatar } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ _id: id })
    } catch (err) {
        const error = new HttpError('update faild !', 500)
        return next(error)
    }

    if (!existingUser) {
        res.status(422).json({ success: 0, errorMessage: 'کاربری با این مشخصات یافت نشد' })
        return next()
    }

    let userWithDeleteAvatar
    if (!!deleteAvatar && deleteAvatar == 1) {
        try {
            userWithDeleteAvatar = await User.findOneAndUpdate(
                { _id: id },
                { avatar: '', hasAvatar: 0 },
                { new: true }
            )
        } catch (err) {
            const error = new HttpError('update faild !', 500)
            return next(error)
        }
        res.json({ user: userWithDeleteAvatar, message: 'تصویر پروفایل شما با موفقیت حذف شد' })
        return next()
    }

    let updatedUser
    try {
        updatedUser = await User.findOneAndUpdate(
            { _id: id },
            {
                username: username,
                gender: gender,
                avatar: !!req.file ? req.file.path : '',
                hasAvatar: !!req.file ? 1 : 0
            },
            { new: true })
    } catch (err) {
        const error = new HttpError('update faild !', 500)
        return next(error)
    }

    res.json({ user: updatedUser, message: 'ویرایش اطلاعات شما با موفقیت انجام شد' })
}

exports.getUsers = getUsers
exports.singup = singup
exports.login = login
exports.updeteUser = updeteUser
