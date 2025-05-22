
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface LipSyncMouthProps {
  word: string;
  isAnimating: boolean;
  phoneme?: string;
}

// Mapping of phonemes to mouth and tongue shapes
const PHONEME_SHAPES = {
  "A": { openness: 0.7, roundness: 0.3, tonguePosition: 0.3 },  // as in "cat"
  "E": { openness: 0.5, roundness: 0.1, tonguePosition: 0.5 },  // as in "bed"
  "I": { openness: 0.3, roundness: 0.2, tonguePosition: 0.7 },  // as in "fit"
  "O": { openness: 0.6, roundness: 0.9, tonguePosition: 0.2 },  // as in "hot"
  "U": { openness: 0.4, roundness: 0.8, tonguePosition: 0.1 },  // as in "put"
  "F": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5 },  // as in "fish"
  "V": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5 },  // as in "van"
  "P": { openness: 0.0, roundness: 0.3, tonguePosition: 0.3 },  // as in "map"
  "B": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3 },  // as in "bat"
  "M": { openness: 0.0, roundness: 0.5, tonguePosition: 0.3 },  // as in "map"
  "TH": { openness: 0.3, roundness: 0.2, tonguePosition: 0.8 }, // as in "think"
  "L": { openness: 0.4, roundness: 0.1, tonguePosition: 0.9 },  // as in "lip"
  "default": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3 }
};

// Mouth Component
const MouthModel: React.FC<{ openness: number; roundness: number; tonguePosition: number }> = ({ 
  openness, 
  roundness, 
  tonguePosition 
}) => {
  // Calculate mouth dimensions based on phoneme parameters
  const mouthWidth = 1.2 + (roundness * 0.4);
  const mouthHeight = 0.2 + (openness * 0.8);
  const lipThickness = 0.3;
  
  // Reference to animate the tongue
  const tongueRef = useRef<THREE.Mesh>(null);

  // Position tongue based on the phoneme
  useEffect(() => {
    if (tongueRef.current) {
      tongueRef.current.position.y = -0.1 - (tonguePosition * 0.15);
      tongueRef.current.position.z = 0.1 + (tonguePosition * 0.2);
    }
  }, [tonguePosition]);

  return (
    <group>
      {/* Upper lip */}
      <mesh position={[0, mouthHeight/2 + lipThickness/4, 0]}>
        <boxGeometry args={[mouthWidth, lipThickness/2, 0.5]} />
        <meshStandardMaterial color="#cc6666" />
      </mesh>
      
      {/* Lower lip */}
      <mesh position={[0, -mouthHeight/2 - lipThickness/4, 0]}>
        <boxGeometry args={[mouthWidth, lipThickness/2, 0.5]} />
        <meshStandardMaterial color="#cc6666" />
      </mesh>
      
      {/* Mouth cavity (dark inside) */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[mouthWidth - 0.1, mouthHeight, 0.3]} />
        <meshStandardMaterial color="#330000" />
      </mesh>
      
      {/* Tongue */}
      <mesh 
        ref={tongueRef}
        position={[0, -0.2, 0.1]} 
        rotation={[tonguePosition * 0.5, 0, 0]}
      >
        <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>
      
      {/* Teeth (upper) */}
      <mesh position={[0, mouthHeight/2 - 0.05, 0.1]}>
        <boxGeometry args={[mouthWidth - 0.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Teeth (lower) */}
      <mesh position={[0, -mouthHeight/2 + 0.05, 0.1]}>
        <boxGeometry args={[mouthWidth - 0.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
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
    <div className="mouth-model-container w-full h-full min-h-[128px] rounded-lg overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
      <div className="phoneme-indicator text-xs font-mono text-center absolute top-1 left-0 right-0 z-10 bg-black/20 text-white py-0.5">
        {currentPhoneme && `Phoneme: ${currentPhoneme}`}
      </div>
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <MouthModel 
          openness={mouthShape.openness} 
          roundness={mouthShape.roundness} 
          tonguePosition={mouthShape.tonguePosition} 
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
