const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    socketId: {
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
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User