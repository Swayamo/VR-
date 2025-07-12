import { useEffect, useState } from 'react'
import { useStore } from '../store'

// Product modal component with improved design
function ProductModal() {
  const selectedProduct = useStore((state) => state.selectedProduct)
  const clearSelectedProduct = useStore((state) => state.clearSelectedProduct)
  const addToCart = useStore((state) => state.addToCart)

  if (!selectedProduct) return null

  return (
    <div className="modal-overlay" onClick={clearSelectedProduct}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={clearSelectedProduct}>×</button>
        <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
        <div className="modal-details">
          <h2>{selectedProduct.name}</h2>
          <p className="modal-description">{selectedProduct.description}</p>
          <div className="modal-price-rating">
            <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
            <span className="modal-rating">⭐ {selectedProduct.rating}</span>
          </div>
          <button className="modal-add-to-cart" onClick={() => addToCart(selectedProduct)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Cart panel component that shows cart items when clicked
function CartPanel() {
  const cart = useStore((state) => state.cart)
  const clearCart = useStore((state) => state.clearCart)
  const [isOpen, setIsOpen] = useState(false)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <div className={`cart-container ${isOpen ? 'open' : ''}`}>
      <div className="cart-toggle" onClick={() => setIsOpen(!isOpen)}>
        🛒 <span className="cart-count-badge">{totalItems}</span>
      </div>
      <div className="cart-content">
        <h3>My Cart</h3>
        {cart.length > 0 ? (
          <>
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-ui">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <button className="cart-clear" onClick={clearCart}>Clear Cart</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  )
}

// Main UI component
export function UI() {
  return (
    <>
      <div className="crosshair">+</div>
      <CartPanel />
      <ProductModal />
    </>
  )
}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-row">
        <label>Search:</label>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="filter-badge">
        {categoryFilter !== 'All' && (
          <span className="category-badge">
            {categoryFilter}
            <button onClick={() => setCategoryFilter('All')}>×</button>
          </span>
        )}
        {searchQuery && (
          <span className="search-badge">
            "{searchQuery}"
            <button onClick={() => setSearchQuery('')}>×</button>
          </span>
        )}
      </div>
    </div>
  )
}

// Enhanced Cart panel component that shows cart items when clicked
function CartPanel() {
  const cart = useStore((state) => state.cart)
  const toggleCartOpen = useStore((state) => state.toggleCartOpen)
  const [showCartItems, setShowCartItems] = useState(false)
  
  const [bounce, setBounce] = useState(false)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  
  useEffect(() => {
    if (cart.length > 0) {
      setBounce(true)
      setTimeout(() => setBounce(false), 500)
    }
  }, [cart.length])

  const handleCartClick = () => {
    setShowCartItems(!showCartItems)
    toggleCartOpen && toggleCartOpen()
  }
  
  return (
    <div className="cart-container">
      <div className={`cart-panel ${bounce ? 'bounce' : ''}`} onClick={handleCartClick}>
        <div className="cart-icon">🛒</div>
        <div className="cart-info">
          <div className="cart-count">{totalItems}</div>
          <div>item{totalItems !== 1 ? 's' : ''}</div>
        </div>
      </div>
      
      {/* Cart items dropdown */}
      {showCartItems && (
        <div className="cart-dropdown">
          <h3>Shopping Cart</h3>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        ${item.price.toFixed(2)} × {item.quantity || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="checkout-button">
                Checkout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Controls hint component with better visibility
function ControlsHint() {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div 
      className={`controls-panel ${expanded ? 'expanded' : 'collapsed'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <h3>{expanded ? 'Controls' : '🎮'}</h3>
      {expanded && (
        <>
          <div className="control-item">
            <span className="key">WASD</span>
            <span className="action">Move</span>
          </div>
          <div className="control-item">
            <span className="key">Mouse</span>
            <span className="action">Look</span>
          </div>
          <div className="control-item">
            <span className="key">Click</span>
            <span className="action">Select</span>
          </div>
          <div className="control-item">
            <span className="key">Space</span>
            <span className="action">Jump</span>
          </div>
        </>
      )}
    </div>
  )
}

// Voice assistant component with active state
function VoiceAssistant() {
  const voiceAssistantActive = useStore((state) => state.voiceAssistantActive)
  const toggleVoiceAssistant = useStore((state) => state.toggleVoiceAssistant)
  
  return (
    <div className="voice-assistant">
      <button 
        className={`voice-button ${voiceAssistantActive ? 'active' : ''}`} 
        onClick={toggleVoiceAssistant}
        title={voiceAssistantActive ? "Voice Assistant Active" : "Activate Voice Assistant"}
      >
        {voiceAssistantActive ? '🔴' : '🎤'}
      </button>
      {voiceAssistantActive && (
        <div className="voice-tooltip">Listening...</div>
      )}
    </div>
  )
}

// Audio player for background music with volume control
function AudioPlayer() {
  const [audio] = useState(new Audio('/assets/audio/ambient.mp3'))
  const [playing, setPlaying] = useState(false)
  
  useEffect(() => {
    audio.volume = 0.2
    audio.loop = true
    
    const playAudio = () => {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaying(true)
          })
          .catch(error => {
            console.info("Autoplay prevented:", error)
          })
      }
    }
    
    const handleFirstInteraction = () => {
      playAudio()
      document.removeEventListener('click', handleFirstInteraction)
    }
    
    document.addEventListener('click', handleFirstInteraction)
    
    return () => {
      audio.pause()
      audio.currentTime = 0
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [audio])
  
  return (
    <div className="audio-controls">
      <button 
        className={`audio-button ${playing ? 'playing' : ''}`}
        onClick={() => {
          if (playing) {
            audio.pause()
          } else {
            audio.play()
          }
          setPlaying(!playing)
        }}
      >
        {playing ? '🔊' : '🔇'}
      </button>
    </div>
  )
}

// Main UI component
export function UI() {
  return (
    <div className="ui-container">
      <div className="crosshair">+</div>
      <FilterPanel />
      <CartPanel />
      <ControlsHint />
      <VoiceAssistant />
      <AudioPlayer />
      <ProductModal />
    </div>
  )
}
