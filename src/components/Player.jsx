import { useRef, useEffect, useState } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Vector3 } from 'three'

export function Player({ position = [0, 2, 10] }) {
  const { camera } = useThree()
  
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  })

  // Improved physics body with better parameters for smooth movement
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position,
    args: [0.5],
    linearDamping: 0.75, // Add damping for smoother deceleration
    material: { friction: 0.1 }, // Small amount of friction feels more realistic
  }))

  // Track velocity for jumping logic and smoother movement
  const velocity = useRef([0, 0, 0])
  const playerPosition = useRef([0, 0, 0])
  
  // Add movement smoothing variables
  const targetDirection = useRef(new Vector3())
  const currentDirection = useRef(new Vector3())
  const footstepTimer = useRef(0)
  const bobTimer = useRef(0)
  
  useEffect(() => {
    // Subscribe to both velocity and position changes
    const unsubVelocity = api.velocity.subscribe(v => velocity.current = v)
    const unsubPosition = api.position.subscribe(p => playerPosition.current = p)
    
    return () => {
      unsubVelocity()
      unsubPosition()
    }
  }, [api.velocity, api.position])

  // Pointer lock controls for camera
  const controlsRef = useRef()

  // Direct keyboard event handling
  useEffect(() => {
    console.log("Setting up keyboard controls")
    
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':
          setKeys(keys => ({ ...keys, forward: true }))
          break
        case 'KeyS': case 'ArrowDown':
          setKeys(keys => ({ ...keys, backward: true }))
          break
        // Swapped A and D keys
        case 'KeyD': case 'ArrowLeft':  // Changed from 'KeyA' to 'KeyD' for left
          setKeys(keys => ({ ...keys, left: true }))
          break
        case 'KeyA': case 'ArrowRight': // Changed from 'KeyD' to 'KeyA' for right
          setKeys(keys => ({ ...keys, right: true }))
          break
        case 'Space':
          setKeys(keys => ({ ...keys, jump: true }))
          break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':
          setKeys(keys => ({ ...keys, forward: false }))
          break
        case 'KeyS': case 'ArrowDown':
          setKeys(keys => ({ ...keys, backward: false }))
          break
        // Swapped A and D keys
        case 'KeyD': case 'ArrowLeft':  // Changed from 'KeyA' to 'KeyD' for left
          setKeys(keys => ({ ...keys, left: false }))
          break
        case 'KeyA': case 'ArrowRight': // Changed from 'KeyD' to 'KeyA' for right
          setKeys(keys => ({ ...keys, right: false }))
          break
        case 'Space':
          setKeys(keys => ({ ...keys, jump: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    // Debug message to verify events are attached
    console.log("Keyboard controls activated")

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Enhanced movement physics with smoothing
  useFrame((state, delta) => {
    if (!controlsRef.current?.isLocked) return
    
    // Calculate target direction based on keys
    targetDirection.current.set(
      Number(keys.left) - Number(keys.right),
      0,
      Number(keys.backward) - Number(keys.forward)
    )
    
    if (targetDirection.current.length() > 0) {
      targetDirection.current.normalize()
      
      // Apply camera rotation to direction
      targetDirection.current.applyEuler(camera.rotation)
      
      // Head bobbing effect for more realistic walking
      bobTimer.current += delta * (velocity.current[0]**2 + velocity.current[2]**2)
      const bobHeight = Math.sin(bobTimer.current * 10) * 0.03
      
      // Play footstep sounds at appropriate intervals
      footstepTimer.current -= delta
      if (footstepTimer.current <= 0) {
        // We would play footstep sound here
        footstepTimer.current = 0.4 // Reset timer (steps every 0.4 seconds)
      }
    } else {
      // Reset bob timer when not moving
      bobTimer.current = 0
    }
    
    // Smooth acceleration - interpolate current direction toward target direction
    currentDirection.current.lerp(targetDirection.current, delta * 10)
    
    // Apply speed, with sprint if shift key is held
    const speed = keys.sprint ? 10 : 5
    const moveDirection = currentDirection.current.clone().multiplyScalar(speed)
    
    // Apply movement with current vertical velocity preserved
    api.velocity.set(moveDirection.x, velocity.current[1], moveDirection.z)
    
    // Improved jump with better ground detection
    const isNearGround = Math.abs(velocity.current[1]) < 0.2
    if (keys.jump && isNearGround) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2])
      // Add jump sound effect here
    }
    
    // Update camera with smooth positioning
    if (playerPosition.current) {
      // Eye height with subtle bob effect when walking
      const eyeHeight = 1.7 + (targetDirection.current.length() > 0.1 ? 
                              Math.sin(bobTimer.current * 10) * 0.03 : 0)
      
      camera.position.set(
        playerPosition.current[0],
        playerPosition.current[1] + eyeHeight,
        playerPosition.current[2]
      )
    }
  })

  // Help message for controls
  useEffect(() => {
    const helpElement = document.createElement('div')
    helpElement.style.position = 'absolute'
    helpElement.style.bottom = '10px'
    helpElement.style.left = '10px'
    helpElement.style.color = 'white'
    helpElement.style.backgroundColor = 'rgba(0,0,0,0.5)'
    helpElement.style.padding = '10px'
    helpElement.style.fontFamily = 'Arial, sans-serif'
    helpElement.style.zIndex = '1000'
    helpElement.innerHTML = 'Click to enable controls<br>WASD / Arrow Keys: Move<br>Space: Jump<br>Mouse: Look around'
    
    document.body.appendChild(helpElement)
    
    return () => {
      document.body.removeChild(helpElement)
    }
  }, [])

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Invisible player body */}
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Simple footstep indicators */}
      <group position={[0, -1, 0]}>
        <mesh
          rotation={[-Math.PI/2, 0, 0]}
          position={[0.2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial color="#333" opacity={0.5} transparent />
        </mesh>
        <mesh
          rotation={[-Math.PI/2, 0, 0]}
          position={[-0.2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial color="#333" opacity={0.5} transparent />
        </mesh>
      </group>
    </>
  )
}