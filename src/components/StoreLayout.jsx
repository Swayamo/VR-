import { useBox, usePlane } from '@react-three/cannon'
import { useTexture, MeshReflectorMaterial } from '@react-three/drei'
import { RepeatWrapping } from 'three'

// Colors for Minecraft-like voxel style
const COLORS = {
  FLOOR: '#8B4513', // Brown
  WALL: '#E0E0E0',  // Light gray
  CEILING: '#FFFFFF', // White
  SHELVES: '#7e481c'  // Dark brown
}

function Floor() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0],
    type: 'Static'
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        color={COLORS.FLOOR}
        roughness={0.6}
        metalness={0.1}
        mirror={0.5}
        resolution={512}
      />
    </mesh>
  )
}

function Ceiling() {
  const [ref] = usePlane(() => ({ 
    rotation: [Math.PI / 2, 0, 0], 
    position: [0, 10, 0],
    type: 'Static'
  }))

  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={COLORS.CEILING} />
    </mesh>
  )
}

function Wall({ position, rotation, size }) {
  const [ref] = useBox(() => ({ 
    position,
    rotation,
    args: size,
    type: 'Static'
  }))

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={COLORS.WALL} />
    </mesh>
  )
}

function Shelf({ position, size = [10, 0.5, 3] }) {
  const [ref] = useBox(() => ({
    position,
    args: size,
    type: 'Static'
  }))

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={COLORS.SHELVES} />
    </mesh>
  )
}

// Create a department with shelves
function Department({ position, rotation = [0, 0, 0], shelves = 3, label }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Department shelves */}
      {Array.from({ length: shelves }).map((_, i) => (
        <Shelf 
          key={i} 
          position={[0, 1 + i * 2, 0]} 
        />
      ))}
      
      {/* Department dividers/walls */}
      <Wall 
        position={[-5.5, 5, 0]} 
        size={[1, 10, 4]} 
      />
      
      <Wall 
        position={[5.5, 5, 0]} 
        size={[1, 10, 4]} 
      />
      
      {/* Department sign/label */}
      <mesh position={[0, 9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 1]} />
        <meshStandardMaterial color="#FFD700" /> {/* Gold color for signs */}
      </mesh>
    </group>
  )
}

export function StoreLayout() {
  const storeWidth = 50
  const storeLength = 60
  const storeHeight = 10
  
  return (
    <>
      {/* Floor and ceiling */}
      <Floor />
      <Ceiling />
      
      {/* Outer walls */}
      <Wall position={[-storeWidth/2, storeHeight/2, 0]} size={[1, storeHeight, storeLength]} />
      <Wall position={[storeWidth/2, storeHeight/2, 0]} size={[1, storeHeight, storeLength]} />
      <Wall position={[0, storeHeight/2, -storeLength/2]} size={[storeWidth, storeHeight, 1]} />
      <Wall position={[0, storeHeight/2, storeLength/2]} size={[storeWidth, storeHeight, 1]} />

      {/* Store entrance */}
      <Wall position={[0, storeHeight/2, storeLength/2 - 10]} size={[10, storeHeight, 1]} />
      <Wall position={[15, storeHeight/2, storeLength/2 - 10]} size={[20, storeHeight, 1]} />
      <Wall position={[-15, storeHeight/2, storeLength/2 - 10]} size={[20, storeHeight, 1]} />
      
      {/* Departments */}
      <Department position={[-15, 0, -10]} label="Electronics" />
      <Department position={[0, 0, -10]} label="Clothing" />
      <Department position={[15, 0, -10]} label="Groceries" />
      
      <Department position={[-15, 0, 10]} rotation={[0, Math.PI, 0]} label="Toys" />
      <Department position={[0, 0, 10]} rotation={[0, Math.PI, 0]} label="Home" />
      <Department position={[15, 0, 10]} rotation={[0, Math.PI, 0]} label="Garden" />
    </>
  )
}
