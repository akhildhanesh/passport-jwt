require('dotenv').config()

const opts = {}
opts.secretOrKey = process.env.JWT_SECRET; //openssl rand -base64 32 | pbcopy
opts.issuer = 'accounts.company.com';
opts.audience = 'yoursite.net';

module.exports = opts