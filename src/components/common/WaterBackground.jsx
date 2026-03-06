import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WaterMesh = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
        meshRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;
    });

    return (
        <Sphere ref={meshRef} args={[1.5, 100, 100]} scale={2.5}>
            <MeshDistortMaterial
                color="#0ea5e9"
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.1}
                metalness={0.8}
                opacity={0.4}
                transparent
            />
        </Sphere>
    );
};

const WaterBackground = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <WaterMesh />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div >
    );
};

export default WaterBackground;
