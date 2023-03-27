const express = require('express')
const {Users, validateUser} = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')
const { validateMessage, Message } = require('../models/message')
const router = express.Router()


router.get('/home', auth, (req, res)=>{
    res.status(200).json({user: req.user})
})


// register route
router.post('/register', async(req, res)=>{
    try{
        const {name, email, phone, work, password, cPassword} = req.body
        const joiResult = validateUser(req.body)
        if(joiResult.error) return res.status(400).json({message: joiResult.error.message})
        const searchedUser = await Users.findOne({email})
        if(searchedUser) return res.status(400).json({message: 'Email is already registered'})
        let addedUser = new Users({name, email, phone, work, password, cPassword})
        addedUser = await addedUser.save()
        res.status(201).json({message: "registered success"})
    }catch(err){
        console.log(err)
    }
})

// login route
router.post('/login', async(req, res)=>{
    const {email, password} = req.body
    const searchedUser = await Users.findOne({email})
    if(!searchedUser) return res.status(400).json({message: 'Incorrect email or password'})
    const checkPass = await bcrypt.compare(password, searchedUser.password)
    if(!checkPass) return res.status(400).json({message: 'Incorrect email or password'})
    const token = await searchedUser.genAuthToken()

    res.cookie('jwtToken', token, {
        expires: new Date(Date.now() + 1000*60*60*24*15),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
    // console.log("token: ", token)
    // console.log(req.cookies.jwtToken)
    res.status(200).json({message: 'User logged in successfully'})
})

router.get('/about', auth,(req, res)=>{
    res.status(200).json({user: req.user})
})

router.get('/contact', auth,(req, res)=>{
    res.status(200).json({user: req.user})
})

router.post('/message', async(req, res)=>{
    const {name, email, phone, message} = req.body
    const {error} = validateMessage(req.body)
    if(error) return res.status(400).json({message: error.message})
    const createdMessage = new Message({
        "Sender Name" : name,
        "Sender Email" : email,
        "Sender Phone" : phone,
        Message : message
    })
    await createdMessage.save()
    res.status(200).send({message: "Message Sent"})
})

router.get('/logout', async(req, res)=>{
    res.clearCookie('jwtToken')
    res.status(200).json({message: 'User logged out'})
})
  

module.exports = router