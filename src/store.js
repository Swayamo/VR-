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
  
  addToCart: (product) => {
    const cart = [...get().cart]
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    saveCart(cart)
    set({ cart })
  },
  
  removeFromCart: (productId) => {
    const cart = get().cart.filter(item => item.id !== productId)
    saveCart(cart)
    set({ cart })
  },
  
  toggleCartOpen: () => set(state => ({ cartOpen: !state.cartOpen })),
  
  toggleVoiceAssistant: () => set(state => ({ 
    voiceAssistantActive: !state.voiceAssistantActive 
  })),
  
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
