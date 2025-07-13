import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

// Define product colors by category
const CATEGORY_COLORS = {
  'Electronics': '#4287f5',
  'Groceries': '#42f54e',
  'Clothing': '#f54242',
  'Toys': '#f5a742',
  'Home': '#b142f5',
  'Garden': '#42f5c8'
}

// Individual product component with optimized animations
function Product({ product, position }) {
  const selectProduct = useStore((state) => state.selectProduct)
  const [hover, setHover] = useState(false)
  const animationRef = useRef({ time: Math.random() * Math.PI * 2 })
  
  // Use simple color-based material instead of textures
  const color = CATEGORY_COLORS[product.category] || '#ffffff'
  
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [1, 1, 1],
  }))
  
  // Optimized click handler
  const handleClick = useCallback(() => {
    selectProduct(product)
  }, [selectProduct, product])

  const handlePointerOver = useCallback(() => setHover(true), [])
  const handlePointerOut = useCallback(() => setHover(false), [])
  
  // Smoother animation with reduced frequency
  useFrame((state, delta) => {
    if (!ref.current) return

    animationRef.current.time += delta

    if (hover) {
      ref.current.position.y = position[1] + 0.5 + Math.sin(animationRef.current.time * 3) * 0.08
      ref.current.rotation.y += delta * 2
    } else {
      ref.current.position.y = position[1] + Math.sin(animationRef.current.time * 0.8) * 0.05
      ref.current.rotation.y = Math.sin(animationRef.current.time * 0.5) * 0.1
    }
  })

  return (
    <group>
      {/* Product box */}
      <mesh 
        ref={ref}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hover ? 0.3 : 0.05}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Only show product name on hover */}
      {hover && (
        <Text
          position={[position[0], position[1] - 1, position[2]]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {product.name}
        </Text>
      )}
      
      {/* Price tag when hovering */}
      {hover && (
        <group position={[position[0], position[1] - 0.7, position[2]]}>
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[0.8, 0.3]} />
            <meshBasicMaterial color="#0071dc" />
          </mesh>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            ${product.price?.toFixed(2) || '0.00'}
          </Text>
        </group>
      )}
    </group>
  )
}

// Component to display all products
export function ProductsDisplay() {
  const products = useStore((state) => state.products)
  const getFilteredProducts = useStore((state) => state.getFilteredProducts)

  const filteredProducts = useMemo(() => {
    return getFilteredProducts ? getFilteredProducts() : products
  }, [products, getFilteredProducts])

  const departmentPositions = {
    'Electronics': { basePos: [-15, 1.5, -10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] },
    'Clothing': { basePos: [0, 1.5, -10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] },
    'Groceries': { basePos: [15, 1.5, -10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] },
    'Toys': { basePos: [-15, 1.5, 10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] },
    'Home': { basePos: [0, 1.5, 10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] },
    'Garden': { basePos: [15, 1.5, 10], itemsPerShelf: 3, spacing: 2.5, shelfHeights: [1.5, 3.5, 5.5] }
  }

  const productPositions = useMemo(() => {
    const positions = {}
    const productsByCategory = {}

    filteredProducts.forEach(product => {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = []
      }
      productsByCategory[product.category].push(product)
    })

    Object.entries(productsByCategory).forEach(([category, categoryProducts]) => {
      const departmentConfig = departmentPositions[category]
      if (!departmentConfig) return

      const { basePos, itemsPerShelf, shelfHeights } = departmentConfig

      categoryProducts.forEach((product, index) => {
        const shelfIndex = Math.floor(index / itemsPerShelf)
        const positionOnShelf = index % itemsPerShelf

        const shelfHeight = shelfHeights[shelfIndex % shelfHeights.length]
        const spacing = 2.0
        const offset = (positionOnShelf - (itemsPerShelf - 1) / 2) * spacing

        positions[product.id] = [
          basePos[0] + offset,
          shelfHeight,
          basePos[2]
        ]
      })
    })

    return positions
  }, [filteredProducts])

  if (filteredProducts.length === 0) {
    return (
      <Text
        position={[0, 2, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading products...
      </Text>
    )
  }

  return (
    <group>
      {filteredProducts.map(product => (
        <Product
          key={product.id}
          product={product}
          position={productPositions[product.id] || [0, -100, 0]}
        />
      ))}
    </group>
  )
}
