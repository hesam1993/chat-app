
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket)=>{
    socket.emit('join', 'Welcome to the network'+socket.id)
    socket.broadcast.emit('server-message', 'a new user is joined')

    socket.on('client-message', (message)=>{
        io.emit('server-message', message)
    })
    socket.on('disconnect', ()=>{
        io.emit('server-message', 'a user has left')
    })
})


server.listen(port, () => {
	console.log('Server is running on port ' + port)
})