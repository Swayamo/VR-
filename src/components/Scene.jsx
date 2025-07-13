import { Suspense, useEffect } from 'react'
import { Physics } from '@react-three/cannon'
import { Sky, Environment, ContactShadows, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { Player } from './Player'
import { StoreLayout } from './StoreLayout'
import { ProductsDisplay } from './ProductsDisplay'

// Improved Walmart wall with high-quality text branding and blue/yellow accent
function WallWithBranding({ position, rotation, width, height }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#0071dc" />
      </mesh>
      {/* Walmart spark logo */}
      <group position={[0, height / 4, 0.06]} scale={[1.2, 1.2, 1.2]}>
        <mesh>
          <cylinderGeometry args={[width / 20, width / 20, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ffc220" emissive="#ffc220" emissiveIntensity={0.3} />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <group key={i} rotation={[0, 0, (Math.PI / 3) * i]}>
            <mesh position={[width / 12, 0, 0.05]}>
              <boxGeometry args={[width / 10, width / 50, 0.1]} />
              <meshStandardMaterial color="#ffc220" emissive="#ffc220" emissiveIntensity={0.3} />
            </mesh>
          </group>
        ))}
        <Text
          position={[0, -width / 10, 0.1]}
          fontSize={width / 30}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          WALMART
        </Text>
      </group>
      {/* Blue accent bar under logo */}
      <mesh position={[0, height / 4 - width / 15, 0.11]}>
        <boxGeometry args={[width / 4, width / 80, 0.05]} />
        <meshStandardMaterial color="#0071dc" />
      </mesh>
      {/* Slogan */}
      <Text
        position={[0, -height / 4, 0.06]}
        fontSize={width / 40}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Save Money. Live Better.
      </Text>
    </group>
  )
}

// Department signage
function DepartmentSigns() {
  const departments = [
    { name: "ELECTRONICS", position: [-25, 10, -30], color: "#4287f5" },
    { name: "GROCERY", position: [20, 10, -30], color: "#42f54e" },
    { name: "CLOTHING", position: [-25, 10, 30], color: "#f54242" },
    { name: "HOME", position: [20, 10, 30], color: "#b142f5" },
  ]
  return (
    <>
      {departments.map((dept, i) => (
        <group key={i} position={dept.position}>
          <mesh>
            <boxGeometry args={[15, 3, 0.2]} />
            <meshStandardMaterial color="#0071dc" />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[14, 2, 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, -1.2, 0.2]}>
            <boxGeometry args={[14, 0.4, 0.1]} />
            <meshStandardMaterial color={dept.color} emissive={dept.color} emissiveIntensity={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.21]}
            fontSize={2}
            color="#0071dc"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {dept.name}
          </Text>
        </group>
      ))}
    </>
  )
}

// Simple, non-reflective floor without flickering
function EnhancedFloor() {
  return (
    <group>
      {/* Main floor - single solid surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Simple contact shadows only */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.3}
        width={150}
        height={150}
        blur={2}
        far={8}
        resolution={512}
        color="#000000"
      />
    </group>
  )
}

export function Scene() {
  const { gl, camera, scene } = useThree()
  const setProducts = useStore((state) => state.setProducts)

  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.setClearColor('#87CEEB')
    scene.fog = new THREE.Fog('#87CEEB', 30, 100)
    camera.position.set(0, 1.7, 15)
    camera.lookAt(0, 1.7, 0)
  }, [gl, camera, scene])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        const processedData = data.map((product) => ({
          ...product,
          image: product.image || "https://via.placeholder.com/150x150/cccccc/000000?text=No+Image"
        }))
        setProducts(processedData)
        console.log('Products loaded:', processedData.length)
      } catch (error) {
        console.error('Error loading products:', error)
        const fallbackProducts = [
          { 
            id: 1, 
            name: "Samsung TV", 
            price: 499.99, 
            category: "Electronics", 
            description: "4K Smart TV", 
            rating: 4.5, 
            image: "https://via.placeholder.com/150x150/4287f5/white?text=TV" 
          },
          { 
            id: 2, 
            name: "Fresh Apples", 
            price: 3.99, 
            category: "Groceries", 
            description: "Organic apples", 
            rating: 4.8, 
            image: "https://via.placeholder.com/150x150/42f54e/white?text=Apples" 
          },
          { 
            id: 3, 
            name: "Blue Jeans", 
            price: 29.99, 
            category: "Clothing", 
            description: "Classic jeans", 
            rating: 4.2, 
            image: "https://via.placeholder.com/150x150/f54242/white?text=Jeans" 
          }
        ]
        setProducts(fallbackProducts)
        console.log('Using fallback products:', fallbackProducts.length)
      }
    }
    fetchProducts()
  }, [setProducts])

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={0.5} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[0, 50, 0]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[-10, 8, 0]} intensity={0.8} distance={20} castShadow />
      <pointLight position={[10, 8, 0]} intensity={0.8} distance={20} castShadow />
      <pointLight position={[0, 8, -10]} intensity={0.8} distance={20} castShadow />
      <pointLight position={[0, 8, 10]} intensity={0.8} distance={20} castShadow />
      <spotLight position={[-15, 10, -15]} angle={0.3} penumbra={0.6} intensity={0.8} color="#0071dc" castShadow />
      <spotLight position={[15, 10, 15]} angle={0.3} penumbra={0.6} intensity={0.8} color="#0071dc" castShadow />
      <Physics gravity={[0, -30, 0]} defaultContactMaterial={{ friction: 0.1, restitution: 0.1 }} iterations={8}>
        <Suspense fallback={null}>
          <Player position={[0, 3, 15]} />
          <StoreLayout />
          <ProductsDisplay />
          <EnhancedFloor />
          <DepartmentSigns />
          <WallWithBranding position={[0, 10, -50]} rotation={[0, 0, 0]} width={100} height={20} />
          <WallWithBranding position={[0, 10, 50]} rotation={[0, Math.PI, 0]} width={100} height={20} />
          <WallWithBranding position={[-50, 10, 0]} rotation={[0, Math.PI / 2, 0]} width={100} height={20} />
          <WallWithBranding position={[50, 10, 0]} rotation={[0, -Math.PI / 2, 0]} width={100} height={20} />
        </Suspense>
      </Physics>
    </>
  );
}
