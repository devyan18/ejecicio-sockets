import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import path from "node:path"
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const messages = []

const addMessage = ({ username, message }) => {
  messages.push({ username, message })

  return messages
}

const getAllMessages = () => {
  return messages
}

const server = createServer(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("a user connected")

  // cuando se conecta un nuevo usuario, le enviamos todos los mensajes que se han enviado
  socket.emit("get-messages", getAllMessages())

  // cuando un nuevo mensaje es enviado, lo agregamos a la lista de mensajes y lo enviamos a todos los usuarios
  socket.on("grupal-message", (data) => {
    addMessage(data)
    io.emit("grupal-message", getAllMessages())
  })

  // cuando un usuario esta escribiendo, le enviamos a todos los usuarios que esta escribiendo menos a el mismo
  socket.on("writing-message", ({ username }) => {
    socket.broadcast.emit("writing-message", {username})
  })

  // cuando un usuario deja de escribir, le enviamos a todos los usuarios que dejo de escribir menos a el mismo
  socket.on("stop-writing-message", () => {
    socket.broadcast.emit("stop-writing-message")
  })

  // cuando un usuario se desconecta, lo mostramos en consola
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

app.get("/", (_req, res) => {
  res.sendFile("index.html")
})

server.listen(3000, () => {
  console.log("Server is running on port 3000")
})