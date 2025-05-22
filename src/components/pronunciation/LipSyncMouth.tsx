
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface LipSyncMouthProps {
  word: string;
  isAnimating: boolean;
  phoneme?: string;
}

// Mapping of phonemes to mouth and tongue shapes - enhanced for natural appearance
const PHONEME_SHAPES = {
  "A": { openness: 0.7, roundness: 0.3, tonguePosition: 0.3, lipThickness: 0.25 },  // as in "cat"
  "E": { openness: 0.5, roundness: 0.2, tonguePosition: 0.5, lipThickness: 0.28 },  // as in "bed"
  "I": { openness: 0.3, roundness: 0.2, tonguePosition: 0.7, lipThickness: 0.3 },  // as in "fit"
  "O": { openness: 0.6, roundness: 0.8, tonguePosition: 0.2, lipThickness: 0.32 },  // as in "hot"
  "U": { openness: 0.4, roundness: 0.7, tonguePosition: 0.1, lipThickness: 0.35 },  // as in "put"
  "F": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5, lipThickness: 0.25 },  // as in "fish"
  "V": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5, lipThickness: 0.25 },  // as in "van"
  "P": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, lipThickness: 0.32 },  // as in "map"
  "B": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, lipThickness: 0.32 },  // as in "bat"
  "M": { openness: 0.1, roundness: 0.5, tonguePosition: 0.3, lipThickness: 0.35 },  // as in "map"
  "TH": { openness: 0.3, roundness: 0.2, tonguePosition: 0.8, lipThickness: 0.25 }, // as in "think"
  "L": { openness: 0.4, roundness: 0.1, tonguePosition: 0.9, lipThickness: 0.28 },  // as in "lip"
  "default": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, lipThickness: 0.3 }
};

// Natural Mouth Component
const NaturalMouthModel: React.FC<{ 
  openness: number; 
  roundness: number; 
  tonguePosition: number;
  lipThickness: number;
}> = ({ 
  openness, 
  roundness, 
  tonguePosition,
  lipThickness
}) => {
  // References for animation
  const upperLipRef = useRef<THREE.Mesh>(null);
  const lowerLipRef = useRef<THREE.Mesh>(null);
  const tongueRef = useRef<THREE.Mesh>(null);
  const teethUpperRef = useRef<THREE.Mesh>(null);
  const teethLowerRef = useRef<THREE.Mesh>(null);
  
  // Calculate mouth dimensions based on phoneme parameters
  const mouthWidth = 1.0 + (roundness * 0.5);
  const mouthHeight = 0.1 + (openness * 0.7);
  const lipCurve = 0.2 + (roundness * 0.2);
  
  // Update mouth shape based on parameters
  useEffect(() => {
    if (!upperLipRef.current || !lowerLipRef.current || !tongueRef.current || 
        !teethUpperRef.current || !teethLowerRef.current) return;
    
    // Upper lip position and shape
    upperLipRef.current.position.y = mouthHeight/2 + lipThickness/4;
    upperLipRef.current.scale.x = mouthWidth;
    upperLipRef.current.scale.z = 0.5 + lipCurve;
    
    // Lower lip position and shape
    lowerLipRef.current.position.y = -mouthHeight/2 - lipThickness/4;
    lowerLipRef.current.scale.x = mouthWidth;
    lowerLipRef.current.scale.z = 0.5 + lipCurve;
    
    // Tongue position
    tongueRef.current.position.y = -0.1 - (tonguePosition * 0.15);
    tongueRef.current.position.z = -0.1 + (tonguePosition * 0.3);
    tongueRef.current.rotation.x = -Math.PI/6 + (tonguePosition * Math.PI/4);
    
    // Teeth positions
    teethUpperRef.current.position.y = mouthHeight/2 - 0.05;
    teethLowerRef.current.position.y = -mouthHeight/2 + 0.05;
  }, [mouthWidth, mouthHeight, openness, roundness, tonguePosition, lipCurve, lipThickness]);

  return (
    <group position={[0, 0, 0]}>
      {/* Face background - subtle oval shape */}
      <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ffe0d0" />
      </mesh>
      
      {/* Mouth cavity (dark inside) */}
      <mesh position={[0, 0, -0.15]}>
        <ellipsoidGeometry args={[mouthWidth/2 - 0.05, mouthHeight/2, 0.4]} />
        <meshStandardMaterial color="#5c0f22" />
      </mesh>
      
      {/* Upper lip with natural curve */}
      <mesh ref={upperLipRef}>
        <cylinderGeometry args={[lipThickness*1.1, lipThickness, 0.3, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#e08a8a" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Lower lip with natural curve */}
      <mesh ref={lowerLipRef}>
        <cylinderGeometry args={[lipThickness, lipThickness*1.1, 0.3, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#d07777" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Tongue - more natural curved shape */}
      <mesh ref={tongueRef}>
        <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ff9a9a" />
      </mesh>
      
      {/* Teeth (upper) */}
      <mesh ref={teethUpperRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[mouthWidth - 0.2, 0.12, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Teeth (lower) */}
      <mesh ref={teethLowerRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[mouthWidth - 0.2, 0.12, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
};

export const LipSyncMouth: React.FC<LipSyncMouthProps> = ({ word, isAnimating, phoneme }) => {
  const [mouthShape, setMouthShape] = useState(PHONEME_SHAPES["default"]);
  const [currentPhoneme, setCurrentPhoneme] = useState("");
  const animationRef = useRef<number | null>(null);
  const phonemeIndexRef = useRef(0);
  
  // Break down word into phonemes (simplified)
  const getWordPhonemes = (word: string): string[] => {
    // This is a simplified phoneme extraction
    return word.toUpperCase().split("").map(char => {
      if ("AEIOU".includes(char)) return char;
      if ("BCDFGHJKLMNPQRSTVWXYZ".includes(char)) return char;
      return "";
    }).filter(p => p !== "");
  };

  // Animation loop for phoneme sequence
  useEffect(() => {
    if (!isAnimating || !word) return;
    
    const phonemes = getWordPhonemes(word);
    let startTime = Date.now();
    const phonemeDuration = 300; // ms per phoneme
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed > phonemeDuration) {
        // Move to next phoneme
        phonemeIndexRef.current = (phonemeIndexRef.current + 1) % phonemes.length;
        startTime = now;
        
        const nextPhoneme = phonemes[phonemeIndexRef.current];
        setCurrentPhoneme(nextPhoneme);
        
        // Get mouth shape for this phoneme or use default
        const shape = PHONEME_SHAPES[nextPhoneme as keyof typeof PHONEME_SHAPES] || 
                      PHONEME_SHAPES["default"];
        setMouthShape(shape);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, word]);
  
  // Handle direct phoneme prop change
  useEffect(() => {
    if (phoneme) {
      setCurrentPhoneme(phoneme);
      const shape = PHONEME_SHAPES[phoneme as keyof typeof PHONEME_SHAPES] || 
                    PHONEME_SHAPES["default"];
      setMouthShape(shape);
    }
  }, [phoneme]);

  return (
    <div className="mouth-model-container relative w-full h-full min-h-[180px] rounded-lg overflow-hidden bg-gradient-to-b from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900">
      <div className="phoneme-indicator text-xs font-mono text-center absolute top-1 left-0 right-0 z-10 bg-black/20 text-white py-0.5">
        {currentPhoneme && `Phoneme: ${currentPhoneme}`}
      </div>
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, 5]} intensity={0.4} color="#ffe0c0" />
        <NaturalMouthModel 
          openness={mouthShape.openness} 
          roundness={mouthShape.roundness} 
          tonguePosition={mouthShape.tonguePosition}
          lipThickness={mouthShape.lipThickness}
        />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.5}
          minPolarAngle={Math.PI/2 - 0.5}
          maxPolarAngle={Math.PI/2 + 0.5}
        />
      </Canvas>
    </div>
  );
};
