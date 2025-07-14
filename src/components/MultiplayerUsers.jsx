import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

function OtherUser({ user }) {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current && user.position) {
      meshRef.current.position.set(...user.position)
      if (user.rotation) {
        meshRef.current.rotation.set(...user.rotation)
      }
    }
  })

  return (
    <group>
      {/* User avatar */}
      <mesh ref={meshRef} position={user.position || [0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1.2]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Username label */}
      <Text
        position={[
          (user.position && user.position[0]) || 0,
          ((user.position && user.position[1]) || 0) + 2,
          (user.position && user.position[2]) || 0
        ]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {user.username}
      </Text>
      
      {/* User indicator dot */}
      <mesh position={[
        (user.position && user.position[0]) || 0,
        ((user.position && user.position[1]) || 0) + 2.5,
        (user.position && user.position[2]) || 0
      ]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
    </group>
  )
}

export function MultiplayerUsers() {
  const users = useStore((state) => state.users)
  
  return (
    <group>
      {users.map((user) => (
        <OtherUser key={user.id} user={user} />
      ))}
    </group>
  )
}
