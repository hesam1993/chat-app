const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    private: {
        type: Boolean,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User