const mongoose = require('mongoose')
const DB = process.env.DATABASE
mongoose.connect(DB)
    .then(()=>console.log('Connected to MongoDb'))
    .catch((err)=>console.log('Connection to MongoDb failed'))
