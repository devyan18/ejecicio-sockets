import { bubble } from "./bubble.js";
const socket = io();
let myUsername = "";

myUsername = localStorage.getItem('username')


const form = document.getElementById('form');

document.addEventListener('DOMContentLoaded', () => {

  // se cargan los mensajes previos
  socket.on("get-messages", (chats) => {
    viewMessagesInChat(chats)
  })

  // se escucha si llegan nuevos mensajes
  socket.on("grupal-message", (chats) => {
    viewMessagesInChat(chats)
  })

  socket.on("writing-message", ({username}) => {
    document.getElementById("is-writing").innerText = `${username} esta escribiendo...`
  })

  socket.on("stop-writing-message", () => {
    document.getElementById("is-writing").innerText = ""
  })
})

// mostrar u ocultar el chat si no hay un username guardado
const grupalChat = document.getElementById('grupal-chat')
const usernameContainer = document.getElementById('username-container');

if (!myUsername) {
  grupalChat.style.display = "none"
  usernameContainer.hidden = false
} else {
  grupalChat.hidden = false
  usernameContainer.style.display = 'none'
}

// guardar el username en el localstorage
const usernameForm = document.getElementById('username-form')

usernameForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)

  myUsername = formData.get('username')

  localStorage.setItem('username', myUsername)

  grupalChat.style.display = "block"
  usernameContainer.style.display = 'none'
})

// agrega los mensajes a la vista
const viewMessagesInChat = (chats) => {
    const chat = document.getElementById('chat')

    chat.innerHTML = ''

    chats.forEach(({ username, message }) => {
      chat.innerHTML += bubble({ text: message, isMyMessage: username === myUsername, username: myUsername })
    })
}

// envia un nuevo mensaje cuando se haga submit en el formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target)

  const text = formData.get('text')

  socket.emit('grupal-message', { username: myUsername, message: text })

  // limpiar el input

  e.target.reset()

  socket.emit('stop-writing-message')
  document.getElementById("is-writing").innerText = ""
});

// cuando un usuario esta escribiendo, se envia un evento al servidor
const inputMessage = document.getElementById('input-message')

inputMessage.addEventListener('keydown', () => {
  socket.emit('writing-message', { username: myUsername })
})
