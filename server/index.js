import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Store room data
const rooms = new Map()

// Store user positions and data
const users = new Map()

class Room {
  constructor(id) {
    this.id = id
    this.users = new Set()
    this.cart = []
    this.products = []
  }

  addUser(userId, userData) {
    this.users.add(userId)
    users.set(userId, { ...userData, roomId: this.id })
  }

  removeUser(userId) {
    this.users.delete(userId)
    users.delete(userId)
  }

  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cart.push({ ...product, quantity: 1 })
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId)
  }

  updateUserPosition(userId, position, rotation) {
    const user = users.get(userId)
    if (user) {
      user.position = position
      user.rotation = rotation
    }
  }
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Join room
  socket.on('join-room', (roomId, userData) => {
    console.log(`User ${socket.id} joining room ${roomId}`)
    
    // Leave previous room if any
    if (socket.roomId) {
      socket.leave(socket.roomId)
      const oldRoom = rooms.get(socket.roomId)
      if (oldRoom) {
        oldRoom.removeUser(socket.id)
        socket.to(socket.roomId).emit('user-left', socket.id)
      }
    }

    // Join new room
    socket.join(roomId)
    socket.roomId = roomId

    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Room(roomId))
    }

    const room = rooms.get(roomId)
    room.addUser(socket.id, userData)

    // Send room data to user
    socket.emit('room-joined', {
      roomId,
      cart: room.cart,
      users: Array.from(room.users).map(userId => ({
        id: userId,
        ...users.get(userId)
      })).filter(user => user.id !== socket.id)
    })

    // Notify other users in room
    socket.to(roomId).emit('user-joined', {
      id: socket.id,
      ...userData
    })

    console.log(`Room ${roomId} now has ${room.users.size} users`)
  })

  // Update user position
  socket.on('update-position', (position, rotation) => {
    if (socket.roomId) {
      const room = rooms.get(socket.roomId)
      if (room) {
        room.updateUserPosition(socket.id, position, rotation)
        socket.to(socket.roomId).emit('user-moved', {
          id: socket.id,
          position,
          rotation
        })
      }
    }
  })

  // Add to cart
  socket.on('add-to-cart', (product) => {
    if (socket.roomId) {
      const room = rooms.get(socket.roomId)
      if (room) {
        room.addToCart(product)
        io.to(socket.roomId).emit('cart-updated', room.cart)
        console.log(`Added ${product.name} to room ${socket.roomId} cart`)
      }
    }
  })

  // Remove from cart
  socket.on('remove-from-cart', (productId) => {
    if (socket.roomId) {
      const room = rooms.get(socket.roomId)
      if (room) {
        room.removeFromCart(productId)
        io.to(socket.roomId).emit('cart-updated', room.cart)
        console.log(`Removed product ${productId} from room ${socket.roomId} cart`)
      }
    }
  })

  // Product selection
  socket.on('select-product', (product) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('product-selected', {
        userId: socket.id,
        product
      })
    }
  })

  // Chat message
  socket.on('chat-message', (message) => {
    if (socket.roomId) {
      const user = users.get(socket.id)
      socket.to(socket.roomId).emit('chat-message', {
        userId: socket.id,
        username: user?.username || 'Anonymous',
        message,
        timestamp: Date.now()
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    
    if (socket.roomId) {
      const room = rooms.get(socket.roomId)
      if (room) {
        room.removeUser(socket.id)
        socket.to(socket.roomId).emit('user-left', socket.id)
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(socket.roomId)
          console.log(`Room ${socket.roomId} deleted (empty)`)
        } else {
          console.log(`Room ${socket.roomId} now has ${room.users.size} users`)
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
