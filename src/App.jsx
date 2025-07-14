import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import { Scene } from './components/Scene'
import { UI } from './components/UI'
import { LoadingScreen } from './components/LoadingScreen'
import { RoomEntry } from './components/RoomEntry'
import Cursor from './components/Cursor'
import { useSocket } from './hooks/useSocket'
import { useStore } from './store'
import './App.css'

function VRExperience() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username') || 'Anonymous'
  
  const [canvasReady, setCanvasReady] = useState(false)
  const setRoomId = useStore((state) => state.setRoomId)
  const setSocket = useStore((state) => state.setSocket)
  const setCurrentUser = useStore((state) => state.setCurrentUser)

  // Initialize socket connection
  const socket = useSocket(roomId, username)

  useEffect(() => {
    setRoomId(roomId)
    setSocket(socket)
    setCurrentUser({ username, roomId })
    
    const timer = setTimeout(() => {
      setCanvasReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [roomId, username, socket])

  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            shadows
            camera={{
              fov: 75,
              near: 0.1,
              far: 1000,
              position: [0, 1.7, 15],
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, #87CEEB, #cce7ff)',
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            frameloop="demand"
            performance={{ min: 0.8 }}
            dpr={[1, 2]}
          >
            <Scene />
          </Canvas>
          <UI />
          <Cursor />
        </Suspense>
      </ErrorBoundary>

      {/* Room info display */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        Room: {roomId} | User: {username}
      </div>

      {canvasReady && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            color: 'white',
            background: 'rgba(0,0,0,0.5)',
            padding: '5px',
            borderRadius: '3px',
            fontSize: '12px',
          }}
        >
          VR Walmart Experience (Multiplayer)
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomEntry />} />
        <Route path="/:roomId" element={<VRExperience />} />
      </Routes>
    </Router>
  )
}

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) {
      console.error('Error caught in ErrorBoundary:', error)
    }
  }, [error])

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h2>An error occurred:</h2>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <React.Fragment>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { onError: setError })
      )}
    </React.Fragment>
  )
}

export default App
