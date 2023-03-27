const jwt = require('jsonwebtoken')
const { Users } = require('../models/user')
async function auth(req, res, next){
    // const navigate = 
    try{
        const token = req.cookies.jwtToken
        const jwtVerify = jwt.verify(token, process.env.SECRETKEY)
        const searchedUser = await Users.findOne({_id: jwtVerify._id})
        req.token = token
        req.user = searchedUser
        req.userId = searchedUser._id
        next()
    }catch(err){
        return res.status(401).json({message: 'Not Authorised to perform this task'})
    }
}

module.exports = auth