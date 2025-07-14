import { create } from 'zustand'

// Load cart from localStorage if available
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('vr-walmart-cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return []
  }
}

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem('vr-walmart-cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export const useStore = create((set, get) => ({
  // Product related state
  products: [],
  selectedProduct: null,
  
  // Filtering and search
  categoryFilter: 'All',
  searchQuery: '',
  
  // Cart related state
  cart: loadCart(),
  cartOpen: false,
  
  // Multiplayer state
  users: [],
  currentUser: null,
  roomId: null,
  socket: null,
  
  // Voice assistant state
  voiceAssistantActive: false,
  
  // Actions
  setProducts: (products) => set({ products }),
  
  selectProduct: (product) => set({ selectedProduct: product }),
  
  closeProductModal: () => set({ selectedProduct: null }),
  
  // Add alias for compatibility
  clearSelectedProduct: () => set({ selectedProduct: null }),
  
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Updated cart actions for multiplayer
  setCart: (cart) => {
    set({ cart })
    // Don't save to localStorage in multiplayer mode
    if (!get().roomId) {
      saveCart(cart)
    }
  },
  
  addToCart: (product) => {
    const { socket, roomId } = get()
    
    if (roomId && socket) {
      // Multiplayer mode - use socket
      socket.emit('add-to-cart', product)
    } else {
      // Single player mode - local cart
      const cart = [...get().cart]
      const existingItem = cart.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({ ...product, quantity: 1 })
      }
      
      saveCart(cart)
      set({ cart })
    }
  },
  
  removeFromCart: (productId) => {
    const { socket, roomId } = get()
    
    if (roomId && socket) {
      // Multiplayer mode - use socket
      socket.emit('remove-from-cart', productId)
    } else {
      // Single player mode - local cart
      const cart = get().cart.filter(item => item.id !== productId)
      saveCart(cart)
      set({ cart })
    }
  },
  
  toggleCartOpen: () => set(state => ({ cartOpen: !state.cartOpen })),
  
  toggleVoiceAssistant: () => set(state => ({ 
    voiceAssistantActive: !state.voiceAssistantActive 
  })),
  
  // Multiplayer actions
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set(state => ({
    users: [...state.users, user]
  })),
  
  removeUser: (userId) => set(state => ({
    users: state.users.filter(user => user.id !== userId)
  })),
  
  updateUserPosition: (userId, position, rotation) => set(state => ({
    users: state.users.map(user => 
      user.id === userId 
        ? { ...user, position, rotation }
        : user
    )
  })),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setRoomId: (roomId) => set({ roomId }),
  
  setSocket: (socket) => set({ socket }),
  
  getFilteredProducts: () => {
    const { products, categoryFilter, searchQuery } = get()
    
    return products.filter(product => {
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }
}))
