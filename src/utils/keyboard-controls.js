import { useEffect, useState } from 'react'

// Map of key codes to control actions
const keyMap = {
  'KeyW': 'forward',
  'ArrowUp': 'forward',
  'KeyS': 'backward',
  'ArrowDown': 'backward',
  'KeyA': 'left',
  'ArrowLeft': 'left',
  'KeyD': 'right',
  'ArrowRight': 'right',
  'Space': 'jump',
}

// Custom hook to handle keyboard controls
export function useKeyboardControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code]
      if (action) {
        setMovement((state) => ({ ...state, [action]: true }))
      }
    }
    
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) {
        setMovement((state) => ({ ...state, [action]: false }))
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  return movement
}
