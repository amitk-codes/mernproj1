const mongoose = require('mongoose')
const JOI = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    work: { type: String, required: true },
    password: { type: String, required: true },
    cPassword: { type: String, required: true },
    tokens : [{
        token : { type: String, required: true }
    }]
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
        this.cPassword = this.password
    }
    next()
})

userSchema.methods.genAuthToken = async function(){
    const token = jwt.sign({_id: this._id}, process.env.SECRETKEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

const Users = mongoose.model('user', userSchema)

function validateUser(input) {
    const joiSchema = JOI.object({
        name: JOI.string().required(),
        email: JOI.string().required(),
        work: JOI.string().required(),
        phone: JOI.number().required(),
        password: JOI.string().required(),
        cPassword: JOI.string().valid(JOI.ref('password')).required().error(new Error('Passwords do not match'))
    })
    return joiSchema.validate(input)
}

module.exports.Users = Users
module.exports.validateUser = validateUser