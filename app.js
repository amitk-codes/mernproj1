const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const express = require('express')
const app = express()
require('./db/conn')
const userRoute = require('./routes/user')
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(express.json())

app.use('/', userRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`listening on port ${PORT} `))