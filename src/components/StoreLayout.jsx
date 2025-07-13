import { useBox, usePlane } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { AmbientLight } from 'three'

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
    position: [0, -0.1, 0], // Slightly below visual floor to avoid z-fighting
    type: 'Static'
  }))

  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
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
      <meshBasicMaterial color={COLORS.CEILING} />
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
      <meshBasicMaterial color={COLORS.WALL} />
    </mesh>
  )
}

function Shelf({ position, size = [10, 0.5, 3], textureUrl }) {
  const [ref] = useBox(() => ({
    position,
    args: size,
    type: 'Static'
  }))
  
  // Use fallback color if texture fails to load
  try {
    const texture = useTexture(textureUrl)
    return (
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry args={size} />
        <meshBasicMaterial map={texture} />
      </mesh>
    )
  } catch (error) {
    console.warn('Texture failed to load, using fallback color:', textureUrl)
    return (
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry args={size} />
        <meshBasicMaterial color={COLORS.SHELVES} />
      </mesh>
    )
  }
}

// Create a department with shelves
function Department({ position, rotation = [0, 0, 0], shelves = 3, label, itemTextures }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Department shelves */}
      {Array.from({ length: shelves }).map((_, i) => (
        <Shelf 
          key={i} 
          position={[0, 1 + i * 2, 0]} 
          textureUrl={itemTextures[i % itemTextures.length]} 
        />
      ))}
      
      {/* Department dividers/walls */}
      <Wall 
        position={[-4, 3, 0]} 
        size={[0.5, 6, 2]} 
      />
      
      <Wall 
        position={[4, 3, 0]} 
        size={[0.5, 6, 2]} 
      />
      
      {/* Department sign/label */}
      <mesh position={[0, 9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 1]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

export function StoreLayout() {
  const storeWidth = 50;
  const storeLength = 60;
  const storeHeight = 10;

  // Use sample image URLs with fallback to placeholder service
  const electronicsTextures = [
    'https://th.bing.com/th/id/R.c2aaf32ff00b4e508ffde1d98099187f?rik=k8h3KqtQjEvoJg&riu=http%3a%2f%2fwww.dumpaday.com%2fwp-content%2fuploads%2f2017%2f02%2fthe-random-pictures-14.jpg&ehk=Up3aRTCN0QqKpd5LcPVVFpyn9Lg7lPn2jHcTQZJkSQc%3d&risl=&pid=ImgRaw&r=0',
    'https://via.placeholder.com/150x150/4287f5/white?text=TV',
    'https://via.placeholder.com/150x150/4287f5/white?text=Phone'
  ]
  const clothingTextures = [
    'https://via.placeholder.com/150x150/f54242/white?text=Shirt',
    'https://via.placeholder.com/150x150/f54242/white?text=Jeans',
    'https://via.placeholder.com/150x150/f54242/white?text=Shoes'
  ]
  const groceriesTextures = [
    'https://via.placeholder.com/150x150/42f54e/white?text=Apples',
    'https://via.placeholder.com/150x150/42f54e/white?text=Bread',
    'https://via.placeholder.com/150x150/42f54e/white?text=Milk'
  ]
  const toysTextures = [
    'https://via.placeholder.com/150x150/f5a742/white?text=Robot',
    'https://via.placeholder.com/150x150/f5a742/white?text=Blocks',
    'https://via.placeholder.com/150x150/f5a742/white?text=Bear'
  ]
  const homeTextures = [
    'https://via.placeholder.com/150x150/b142f5/white?text=Pot',
    'https://via.placeholder.com/150x150/b142f5/white?text=Sheets',
    'https://via.placeholder.com/150x150/b142f5/white?text=Knives'
  ]
  const gardenTextures = [
    'https://via.placeholder.com/150x150/42f5c8/white?text=Hose',
    'https://via.placeholder.com/150x150/42f5c8/white?text=Seeds',
    'https://via.placeholder.com/150x150/42f5c8/white?text=Tools'
  ]

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />

      {/* Invisible physics floor */}
      <Floor />
      <Ceiling />

      {/* Outer walls */}
      <Wall position={[-storeWidth / 2, storeHeight / 2, 0]} size={[1, storeHeight, storeLength]} />
      <Wall position={[storeWidth / 2, storeHeight / 2, 0]} size={[1, storeHeight, storeLength]} />
      <Wall position={[0, storeHeight / 2, -storeLength / 2]} size={[storeWidth, storeHeight, 1]} />
      <Wall position={[0, storeHeight / 2, storeLength / 2]} size={[storeWidth, storeHeight, 1]} />

      {/* Store entrance */}
      <Wall position={[0, storeHeight / 2, storeLength / 2 - 10]} size={[10, storeHeight, 1]} />
      <Wall position={[15, storeHeight / 2, storeLength / 2 - 10]} size={[20, storeHeight, 1]} />
      <Wall position={[-15, storeHeight / 2, storeLength / 2 - 10]} size={[20, storeHeight, 1]} />

      {/* Departments */}
      <Department position={[-15, 0, -10]} label="Electronics" itemTextures={electronicsTextures} />
      <Department position={[0, 0, -10]} label="Clothing" itemTextures={clothingTextures} />
      <Department position={[15, 0, -10]} label="Groceries" itemTextures={groceriesTextures} />
      <Department position={[-15, 0, 10]} rotation={[0, Math.PI, 0]} label="Toys" itemTextures={toysTextures} />
      <Department position={[0, 0, 10]} rotation={[0, Math.PI, 0]} label="Home" itemTextures={homeTextures} />
      <Department position={[15, 0, 10]} rotation={[0, Math.PI, 0]} label="Garden" itemTextures={gardenTextures} />
    </>
  );
}

