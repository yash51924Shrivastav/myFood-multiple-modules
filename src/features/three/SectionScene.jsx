import { Canvas } from '@react-three/fiber'
import { Float, Stars, OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'

function Knot({ color }) {
  const material = useMemo(() => ({ color, roughness: 0.3, metalness: 0.2 }), [color])
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh>
        <torusKnotGeometry args={[1.2, 0.4, 120, 16]} />
        <meshStandardMaterial {...material} />
      </mesh>
    </Float>
  )
}

export default function SectionScene({ color = '#c2410c' }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={0.8} />
        <Stars radius={50} depth={20} count={800} factor={4} saturation={0} fade />
        <Knot color={color} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  )
}
