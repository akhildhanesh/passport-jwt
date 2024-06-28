const passport = require('passport')
const User = require('../model/User')
const Admin = require('../model/Admin')
require('dotenv').config()

const { Strategy } = require('passport-jwt')
const { ExtractJwt } = require('passport-jwt')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET; //openssl rand -base64 32 | pbcopy
opts.issuer = 'accounts.company.com';
opts.audience = 'yoursite.net';

passport.use(new Strategy(opts, (jwt_payload, done) => {
    if (jwt_payload.role === 'user') {
        User.findOne({ _id: jwt_payload.id })
            .then(user => {
                if (user) {
                    return done(null, { id: user._id, username: user.username, role: jwt_payload.role })
                } else {
                    return done(null, false)
                }
            })
            .catch(err => {
                return done(err, false)
            })
    } else if (jwt_payload.role === 'admin') {
        Admin.findOne({ _id: jwt_payload.id })
            .then(user => {
                if (user) {
                    return done(null, { id: user._id, username: user.username, role: jwt_payload.role })
                } else {
                    return done(null, false)
                }
            })
            .catch(err => {
                return done(err, false);
            })
    }
}))

module.exports = passport