const mongoose = require('mongoose')
const JOI = require('joi')

const messageSchema = new mongoose.Schema({
    "Sender Name" : {type: String, required: true},
    "Sender Email" : {type: String, required:true},
    "Sender Phone" : {type: Number, required: true},
    Message : {type: String, required: true}
})

function validateMessage(input){
    const joiSchema = JOI.object({
        name: JOI.string().required(),
        email: JOI.string().required(),
        phone: JOI.number().required(),
        message: JOI.string().required()
    })
    return joiSchema.validate(input)
}

const Messages = mongoose.model('message', messageSchema)

module.exports.Message = Messages
module.exports.validateMessage = validateMessage

