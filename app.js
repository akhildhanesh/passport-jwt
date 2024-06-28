const express = require('express')
const app = express()

const userRouter = require('./router/userRouter')
const adminRouter = require('./router/adminRouter')

const PORT = process.env.PORT || 3000

require('./db/connect')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1', userRouter)
app.use('/v1/admin', adminRouter)

app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`))