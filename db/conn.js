const mongoose = require('mongoose')
const DB = process.env.DATABASE
// const DB = 'mongodb+srv://amithello71:amitCluster0@cluster0.q41al7z.mongodb.net/mern-proj-1?retryWrites=true&w=majority'
mongoose.connect(DB)
    .then(()=>console.log('Connected to MongoDb :)'))
    .catch((err)=>console.log('Connection to MongoDb failed :(', err))
