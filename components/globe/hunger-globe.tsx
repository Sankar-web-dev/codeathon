'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Household, HouseholdWithRisk, calculateRiskLevel, getRiskColor } from '@/lib/types';

interface HungerGlobeProps {
  households: Household[];
  onMarkerClick: (household: Household) => void;
  isLoading: boolean;
}

// Pin Marker Component - Google Maps style
function PinMarker({ 
  position, 
  color, 
  household, 
  onClick 
}: { 
  position: [number, number, number]; 
  color: string;
  household: HouseholdWithRisk;
  onClick: (household: Household) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(household);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pin head (sphere) */}
      <mesh position={[0, 3, 0]} scale={hovered ? 1.3 : 1}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Pin stem (cone pointing down) */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.8, 2.5, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Inner white dot */}
      <mesh position={[0, 3, 0.8]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html
          position={[0, 6, 0]}
          center
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="bg-white text-black px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{household.name}</div>
            <div className="text-gray-600 text-xs">{household.location_description}</div>
            <div className="text-xs mt-1">
              Risk Score: <span style={{ color }}>{household.hunger_risk_score}%</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeScene({ households, onMarkerClick, isLoading }: HungerGlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const [householdsWithRisk, setHouseholdsWithRisk] = useState<HouseholdWithRisk[]>([]);

  // Load Earth textures
  const [earthMap, bumpMap, specularMap] = useLoader(TextureLoader, [
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
  ]);

  // Convert lat/lon to 3D coordinates on sphere surface
  const latLonTo3D = (lat: number, lon: number, radius: number = 101): [number, number, number] => {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (-lon * Math.PI) / 180; // Negative for correct orientation

    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);

    return [x, y, z];
  };

  // Process households and calculate risk levels
  useEffect(() => {
    const processed = households.map((h) => {
      const riskLevel = calculateRiskLevel(h.hunger_risk_score);
      return {
        ...h,
        risk_level: riskLevel,
        risk_color: getRiskColor(riskLevel),
      };
    });
    setHouseholdsWithRisk(processed);
  }, [households]);

  // Animation loop - slow rotation
  useFrame(() => {
    if (globeRef.current && !isLoading) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.8} />

      {/* Directional lights for better illumination */}
      <directionalLight position={[100, 50, 100]} intensity={1.5} />
      <directionalLight position={[-100, -50, -100]} intensity={0.3} />

      <group ref={globeRef}>
        {/* Earth sphere */}
        <Sphere args={[100, 64, 64]} position={[0, 0, 0]}>
          <meshPhongMaterial
            map={earthMap}
            bumpMap={bumpMap}
            bumpScale={0.5}
            specularMap={specularMap}
            specular={new THREE.Color('#333333')}
            shininess={5}
          />
        </Sphere>

        {/* Pin markers for each household */}
        {householdsWithRisk.map((household) => {
          const position = latLonTo3D(household.latitude, household.longitude);
          
          // Calculate rotation to make pin point outward from globe center
          const pos = new THREE.Vector3(...position);
          const up = new THREE.Vector3(0, 1, 0);
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(up, pos.clone().normalize());
          
          return (
            <group 
              key={household.id} 
              position={position}
              quaternion={quaternion}
            >
              <PinMarker
                position={[0, 0, 0]}
                color={household.risk_color}
                household={household}
                onClick={onMarkerClick}
              />
            </group>
          );
        })}
      </group>

      {/* Orbit controls */}
      <OrbitControls
        autoRotate={isLoading}
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        minDistance={120}
        maxDistance={400}
      />
    </>
  );
}

export function HungerGlobe({
  households,
  onMarkerClick,
  isLoading = false,
}: HungerGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      <Canvas
        camera={{
          position: [0, 0, 250],
          fov: 45,
          near: 1,
          far: 10000,
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            households={households}
            onMarkerClick={onMarkerClick}
            isLoading={isLoading}
          />
        </Suspense>
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2 text-sm">Hunger Risk Level</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low Risk (0-33%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium Risk (34-66%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk (67-100%)</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
            <p className="text-white text-lg">Loading household data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
