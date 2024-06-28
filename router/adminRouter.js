const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('../jwt/jwt')
const Admin = require('../model/Admin')
const User = require('../model/User')
const bcrypt = require('bcryptjs')

const adminRouter = express.Router()

const opts = require('../jwt/opts')

adminRouter.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const existingAdmin = await Admin.findOne({ username })
        if (existingAdmin) {
            console.log(existingAdmin)
            if (bcrypt.compareSync(password, existingAdmin.password)) {
                const payload = { id: existingAdmin._id, role: 'admin' }
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

adminRouter.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            console.log(existingUser)
            return res.status(400).json({ message: 'Username already exists' })
        }

        const newUser = new User({ username, password })

        try {
            const savedUser = await newUser.save()

            const payload = { id: savedUser._id, role: 'admin' }
            const token = jwt.sign(payload, opts.secretOrKey, { expiresIn: '1h', issuer: opts.issuer, audience: opts.audience, role: 'user' })

            res.json({ message: 'Signup successful!', token })
        } catch (err) {
            res.status(400).json({ message: err.errors.password.message })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})


adminRouter.get('/details', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role != 'admin') return res.sendStatus(401)
    console.log(req.user)
    console.log('User ID:', req.user.id)
    res.json({
        message: "admin details",
        user: req.user
    })
})

module.exports = adminRouter