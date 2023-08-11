const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        trim: true
    },
    usersCount: {
        type: Number,
        default: 1
    }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room