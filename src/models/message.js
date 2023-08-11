const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: {
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
    createdAt: {
        type: Date,
        required: true
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message