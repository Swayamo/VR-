import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './components/Scene'
import { UI } from './components/UI'
import { LoadingScreen } from './components/LoadingScreen'
import './App.css'

function App() {
  const [canvasReady, setCanvasReady] = useState(false)
  
  // Ensure canvas fills the screen properly
  useEffect(() => {
    // Set a small timeout to ensure styles are properly applied
    const timer = setTimeout(() => {
      setCanvasReady(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas 
          shadows 
          camera={{ 
            fov: 75, 
            near: 0.1, 
            far: 1000,
            position: [0, 1.7, 15]
          }}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            background: 'linear-gradient(to bottom, #87CEEB, #cce7ff)'
          }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <Scene />
        </Canvas>
        <UI />
      </Suspense>
      
      {/* Performance monitor - remove in production */}
      {canvasReady && (
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px', 
          color: 'white',
          background: 'rgba(0,0,0,0.5)',
          padding: '5px',
          borderRadius: '3px',
          fontSize: '12px'
        }}>
          VR Walmart Experience
        </div>
      )}
    </div>
  )
}

export default App
