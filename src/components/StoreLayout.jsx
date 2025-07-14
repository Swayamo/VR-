import { useBox, usePlane } from '@react-three/cannon'
import { useTexture, Text } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { AmbientLight } from 'three'

// Updated colors to match Walmart's signature theme
const COLORS = {
  FLOOR: '#F5F5F5',         // Warmer light gray
  WALL: '#FFFFFF',          // White walls (as requested)
  CEILING: '#F0F0F0',       // Light gray ceiling (neutral)
  SHELVES: '#2c3e50',       // Dark blue-gray shelves (modern retail)
  ACCENT: '#ffc220',        // Walmart yellow accent
  DEPARTMENT_SIGN: '#004c91' // Darker blue for department signs to avoid merging with the ceiling
}

function Floor() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -0.1, 0], // Slightly below visual floor to avoid z-fighting
    type: 'Static'
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={COLORS.FLOOR} />
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
      <meshStandardMaterial 
        color={COLORS.WALL} 
        metalness={0.1}
        roughness={0.7}
      />
    </mesh>
  )
}

// Enhanced Walmart-style wall with branding
function WalmartWall({ position, rotation, size, showLogo = false }) {
  const [ref] = useBox(() => ({ 
    position,
    rotation,
    args: size,
    type: 'Static'
  }))

  // Load the Walmart logo texture
  let logoTexture = null
  try {
    logoTexture = useTexture('/walmart-logo.png')
  } catch (error) {
    console.warn('Walmart logo texture not found, using fallback')
  }

  return (
    <group>
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={COLORS.WALL} 
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
      
      {/* Walmart logo and branding */}
      {showLogo && (
        <group position={position} rotation={rotation}>
          {/* Walmart logo as image texture */}
          <group position={[0, 0, size[2]/2 + 0.02]}>
            {logoTexture ? (
              // Use actual Walmart logo image
              <mesh>
                <planeGeometry args={[12, 4]} />
                <meshStandardMaterial 
                  map={logoTexture}
                  transparent={true}
                  alphaTest={0.1}
                />
              </mesh>
            ) : (
              // Fallback to text-based logo
              <group>
                <Text
                  position={[-4, 0, 0]}
                  fontSize={2}
                  color="#0071dc"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                  letterSpacing={0.05}
                >
                  Walmart
                </Text>
                
                {/* Simple spark symbol */}
                <group position={[3, 0, 0]}>
                  <mesh>
                    <circleGeometry args={[0.6, 32]} />
                    <meshStandardMaterial 
                      color={COLORS.ACCENT} 
                      emissive={COLORS.ACCENT} 
                      emissiveIntensity={0.3} 
                    />
                  </mesh>
                  
                  {/* 6 spark rays */}
                  {[...Array(6)].map((_, i) => {
                    const angle = (Math.PI * 2 / 6) * i
                    return (
                      <mesh 
                        key={i} 
                        position={[
                          Math.cos(angle) * 1.2,
                          Math.sin(angle) * 1.2,
                          0
                        ]}
                        rotation={[0, 0, angle]}
                      >
                        <boxGeometry args={[0.8, 0.2, 0.05]} />
                        <meshStandardMaterial 
                          color={COLORS.ACCENT} 
                          emissive={COLORS.ACCENT} 
                          emissiveIntensity={0.3} 
                        />
                      </mesh>
                    )
                  })}
                </group>
              </group>
            )}
            
            {/* Slogan below the logo */}
            <Text
              position={[0, -3, 0]}
              fontSize={0.6}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={15}
              letterSpacing={0.02}
            >
              Save money. Live better.
            </Text>
          </group>
        </group>
      )}
    </group>
  )
}

function Shelf({ position, size = [10, 0.5, 3], textureUrl }) {
  const [ref] = useBox(() => ({
    position,
    args: size,
    type: 'Static'
  }))
  
  // Use brown shelving color
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={COLORS.SHELVES} 
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  )
}

// Create a department with Walmart-style shelves and section label
function Department({ position, rotation = [0, 0, 0], shelves = 3, label, itemTextures }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Section label */}
      <Text
        position={[0, 8.5, 0]} // Moved down from 10 to 8.5 to be fully visible
        fontSize={1.2}
        color={COLORS.DEPARTMENT_SIGN} // Updated to darker blue
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        letterSpacing={0.05}
      >
        {label.toUpperCase()}
      </Text>

      {/* Department shelves with Walmart styling */}
      {Array.from({ length: shelves }).map((_, i) => (
        <Shelf 
          key={i} 
          position={[0, 1 + i * 2, 0]} 
          textureUrl={itemTextures[i % itemTextures.length]} 
        />
      ))}
      
      {/* Dark blue-gray vertical shelf dividers */}
      <mesh position={[-4, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 6, 2]} />
        <meshStandardMaterial 
          color={COLORS.SHELVES} 
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      
      <mesh position={[4, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 6, 2]} />
        <meshStandardMaterial 
          color={COLORS.SHELVES} 
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      
      {/* Enhanced department sign */}
      <group position={[0, 8, 0]}>
        {/* Walmart blue background */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial color={COLORS.DEPARTMENT_SIGN} />
        </mesh>
        
        {/* Yellow accent strip */}
        <mesh position={[0, 0.01, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 0.3]} />
          <meshStandardMaterial color={COLORS.ACCENT} />
        </mesh>
        
        {/* Removed the golden/yellow department text */}
      </group>
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
      {/* Enhanced ambient lighting for Walmart look */}
      <ambientLight intensity={0.6} />

      {/* Floor with proper color */}
      <Floor />
      <Ceiling />

      {/* Walmart-style outer walls with branding */}
      <WalmartWall 
        position={[-storeWidth / 2, storeHeight / 2, 0]} 
        size={[1, storeHeight, storeLength]} 
      />
      <WalmartWall 
        position={[storeWidth / 2, storeHeight / 2, 0]} 
        size={[1, storeHeight, storeLength]} 
      />
      <WalmartWall 
        position={[0, storeHeight / 2, -storeLength / 2]} 
        size={[storeWidth, storeHeight, 1]} 
        showLogo={true}
      />
      <WalmartWall 
        position={[0, storeHeight / 2, storeLength / 2]} 
        size={[storeWidth, storeHeight, 1]} 
      />

      {/* Enhanced store entrance with Walmart styling */}
      <WalmartWall 
        position={[0, storeHeight / 2, storeLength / 2 - 10]} 
        size={[10, storeHeight, 1]} 
      />
      <WalmartWall 
        position={[15, storeHeight / 2, storeLength / 2 - 10]} 
        size={[20, storeHeight, 1]} 
      />
      <WalmartWall 
        position={[-15, storeHeight / 2, storeLength / 2 - 10]} 
        size={[20, storeHeight, 1]} 
      />

      {/* Welcome sign above entrance */}
      <group position={[0, 8, storeLength / 2 - 15]}>
        <mesh>
          <boxGeometry args={[20, 3, 0.2]} />
          <meshStandardMaterial color={COLORS.DEPARTMENT_SIGN} />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          WELCOME TO WALMART
        </Text>
        <mesh position={[0, -1, 0.12]}>
          <boxGeometry args={[18, 0.3, 0.1]} />
          <meshStandardMaterial color={COLORS.ACCENT} />
        </mesh>
      </group>

      {/* Departments with section labels */}
      <Department position={[-15, 0, -10]} label="Electronics" itemTextures={electronicsTextures} />
      <Department position={[0, 0, -10]} label="Clothing" itemTextures={clothingTextures} />
      <Department position={[15, 0, -10]} label="Groceries" itemTextures={groceriesTextures} />
      <Department position={[-15, 0, 10]} rotation={[0, Math.PI, 0]} label="Toys" itemTextures={toysTextures} />
      <Department position={[0, 0, 10]} rotation={[0, Math.PI, 0]} label="Home" itemTextures={homeTextures} />
      <Department position={[15, 0, 10]} rotation={[0, Math.PI, 0]} label="Garden" itemTextures={gardenTextures} />
    </>
  );
}
