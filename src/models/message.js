const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    messageContent: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message