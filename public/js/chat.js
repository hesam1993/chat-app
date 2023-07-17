const socket = io()
console.log('app is running')
const sendBtn = document.querySelector('#send-message')
const message = document.querySelector('#message')
const messages = document.querySelector('#messages')

socket.on('join', (welcomeMessage) => {
    console.log(welcomeMessage)
})

socket.on('server-message', (message) => {
    console.log(message)
    const messageEl = document.createElement('p')
    messageEl.innerHTML = message
    messages.insertAdjacentElement('beforeend', messageEl)
    resetMessageForm()
})

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('client-message', message.value)
})

const resetMessageForm = () => {
    message.value = ''
    message.focus()
}