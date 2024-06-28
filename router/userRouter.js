const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('../jwt/jwt')
const User = require('../model/User')
const bcrypt = require('bcryptjs')

const userRouter = express.Router()

const opts = require('../jwt/opts')

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            if (bcrypt.compareSync(password, existingUser.password)) {
                const payload = { id: existingUser._id, role: 'user' }
                const token = jwt.sign(payload, opts.secretOrKey, { expiresIn: '1h', issuer: opts.issuer, audience: opts.audience })
                return res.json({ message: 'Success', token })
            } else {
                res.status(401).json({ message: 'Incorrect username or password' })
            }
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

userRouter.get('/protected-data', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user)
    console.log('User ID:', req.user.id)

    res.json({
        message: "user details",
        user: req.user
    })
})

module.exports = userRouter