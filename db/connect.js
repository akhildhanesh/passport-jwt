const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/USER')
    .then(() => console.log('DB connected'))
    .catch(e => console.error(e.message))