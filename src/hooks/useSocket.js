import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useStore } from '../store'

export function useSocket(roomId, username) {
  const socketRef = useRef(null)
  const setCart = useStore((state) => state.setCart)
  const setUsers = useStore((state) => state.setUsers)
  const addUser = useStore((state) => state.addUser)
  const removeUser = useStore((state) => state.removeUser)
  const updateUserPosition = useStore((state) => state.updateUserPosition)
  const setSelectedProduct = useStore((state) => state.setSelectedProduct)

  useEffect(() => {
    if (!roomId) return

    // Connect to socket server
    socketRef.current = io('http://localhost:3001')
    const socket = socketRef.current

    // Join room
    socket.emit('join-room', roomId, {
      username,
      position: [0, 2, 15],
      rotation: [0, 0, 0]
    })

    // Listen for room joined
    socket.on('room-joined', (data) => {
      console.log('Joined room:', data)
      setCart(data.cart)
      setUsers(data.users)
    })

    // Listen for cart updates
    socket.on('cart-updated', (cart) => {
      setCart(cart)
    })

    // Listen for user events
    socket.on('user-joined', (user) => {
      console.log('User joined:', user)
      addUser(user)
    })

    socket.on('user-left', (userId) => {
      console.log('User left:', userId)
      removeUser(userId)
    })

    socket.on('user-moved', (data) => {
      updateUserPosition(data.id, data.position, data.rotation)
    })

    // Listen for product selection
    socket.on('product-selected', (data) => {
      // Show notification that another user selected a product
      console.log(`${data.userId} selected product:`, data.product)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [roomId, username])

  return socketRef.current
}

// Export socket utilities
export const socketUtils = {
  addToCart: (socket, product) => {
    if (socket) {
      socket.emit('add-to-cart', product)
    }
  },

  removeFromCart: (socket, productId) => {
    if (socket) {
      socket.emit('remove-from-cart', productId)
    }
  },

  updatePosition: (socket, position, rotation) => {
    if (socket) {
      socket.emit('update-position', position, rotation)
    }
  },

  selectProduct: (socket, product) => {
    if (socket) {
      socket.emit('select-product', product)
    }
  },

  sendChatMessage: (socket, message) => {
    if (socket) {
      socket.emit('chat-message', message)
    }
  }
}
