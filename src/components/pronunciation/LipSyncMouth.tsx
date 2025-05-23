
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface LipSyncMouthProps {
  word: string;
  isAnimating: boolean;
  phoneme?: string;
}

// Enhanced phoneme mapping with more detailed mouth features
const PHONEME_SHAPES = {
  // Vowels
  "A": { openness: 0.7, roundness: 0.3, tonguePosition: 0.3, tongueHeight: 0.2, jawDrop: 0.7, lipThickness: 0.25 },  // as in "cat"
  "E": { openness: 0.5, roundness: 0.2, tonguePosition: 0.5, tongueHeight: 0.5, jawDrop: 0.5, lipThickness: 0.28 },  // as in "bed"
  "I": { openness: 0.3, roundness: 0.2, tonguePosition: 0.7, tongueHeight: 0.6, jawDrop: 0.3, lipThickness: 0.3 },   // as in "fit"
  "O": { openness: 0.6, roundness: 0.8, tonguePosition: 0.2, tongueHeight: 0.2, jawDrop: 0.6, lipThickness: 0.32 },  // as in "hot"
  "U": { openness: 0.4, roundness: 0.7, tonguePosition: 0.1, tongueHeight: 0.3, jawDrop: 0.4, lipThickness: 0.35 },  // as in "put"
  
  // Consonants
  "F": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5, tongueHeight: 0.3, jawDrop: 0.2, lipThickness: 0.25, teethVisible: true },  // as in "fish"
  "V": { openness: 0.2, roundness: 0.1, tonguePosition: 0.5, tongueHeight: 0.3, jawDrop: 0.2, lipThickness: 0.25, teethVisible: true },  // as in "van"
  "P": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, tongueHeight: 0.2, jawDrop: 0.1, lipThickness: 0.32 },  // as in "map"
  "B": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, tongueHeight: 0.2, jawDrop: 0.1, lipThickness: 0.32 },  // as in "bat"
  "M": { openness: 0.1, roundness: 0.5, tonguePosition: 0.3, tongueHeight: 0.2, jawDrop: 0.1, lipThickness: 0.35 },  // as in "map"
  "TH": { openness: 0.3, roundness: 0.2, tonguePosition: 0.8, tongueHeight: 0.7, jawDrop: 0.3, lipThickness: 0.25, tongueVisible: true },  // as in "think"
  "L": { openness: 0.4, roundness: 0.1, tonguePosition: 0.9, tongueHeight: 0.8, jawDrop: 0.4, lipThickness: 0.28, tongueVisible: true },   // as in "lip"
  "S": { openness: 0.2, roundness: 0.3, tonguePosition: 0.7, tongueHeight: 0.5, jawDrop: 0.2, lipThickness: 0.28, teethVisible: true },    // as in "sit"
  "R": { openness: 0.3, roundness: 0.5, tonguePosition: 0.6, tongueHeight: 0.4, jawDrop: 0.3, lipThickness: 0.3, tongueVisible: true },     // as in "run"
  
  // Default
  "default": { openness: 0.1, roundness: 0.3, tonguePosition: 0.3, tongueHeight: 0.2, jawDrop: 0.1, lipThickness: 0.3 }
};

// Educational notes for each phoneme
const PHONEME_NOTES = {
  "A": "Open your mouth wide, tongue flat and low",
  "E": "Medium mouth opening, tongue slightly raised",
  "I": "Small mouth opening, tongue high in mouth",
  "O": "Round lips into an 'O' shape, tongue low",
  "U": "Pucker lips forward, tongue relaxed back",
  "F": "Lower lip touches upper teeth, blow air through",
  "V": "Lower lip touches upper teeth, vibrate voice",
  "P": "Close lips completely, then pop them open",
  "B": "Close lips completely, voice while opening",
  "M": "Lips closed, sound through nose",
  "TH": "Tongue between teeth, blow air through",
  "L": "Tongue tip touches roof of mouth behind teeth",
  "S": "Teeth close together, air hisses through",
  "R": "Tongue curved back, not touching roof",
  "default": "Relaxed mouth position"
};

// Enhanced Natural Mouth Component with animated features
const EnhancedMouthModel: React.FC<{ 
  openness: number; 
  roundness: number; 
  tonguePosition: number;
  tongueHeight: number;
  jawDrop: number;
  lipThickness: number;
  teethVisible?: boolean;
  tongueVisible?: boolean;
}> = ({ 
  openness, 
  roundness, 
  tonguePosition,
  tongueHeight,
  jawDrop,
  lipThickness,
  teethVisible = false,
  tongueVisible = false
}) => {
  // References for animation
  const upperLipRef = useRef<THREE.Mesh>(null);
  const lowerLipRef = useRef<THREE.Mesh>(null);
  const jawRef = useRef<THREE.Group>(null);
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
        !teethUpperRef.current || !teethLowerRef.current || !jawRef.current) return;
    
    // Animate all mouth parts over 300ms for smoother transitions
    const startTime = Date.now();
    const duration = 300;
    
    // Store initial positions
    const initialJawY = jawRef.current.position.y;
    const initialTongueY = tongueRef.current.position.y;
    const initialTongueZ = tongueRef.current.position.z;
    const initialTongueRotX = tongueRef.current.rotation.x;
    
    // Target positions
    const targetJawY = -jawDrop * 0.3;
    const targetTongueY = -0.1 - (tongueHeight * 0.15);
    const targetTongueZ = -0.1 + (tonguePosition * 0.3);
    const targetTongueRotX = -Math.PI/6 + (tonguePosition * Math.PI/4);
    
    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Upper lip position and shape
      if (upperLipRef.current) {
        upperLipRef.current.position.y = mouthHeight/2 + lipThickness/4;
        upperLipRef.current.scale.x = mouthWidth;
        upperLipRef.current.scale.z = 0.5 + lipCurve;
      }
      
      // Jaw and lower lip animation
      if (jawRef.current) {
        // Interpolate jaw position
        jawRef.current.position.y = initialJawY + (targetJawY - initialJawY) * easeProgress;
      }
      
      // Tongue animation
      if (tongueRef.current) {
        // Interpolate tongue position and rotation
        tongueRef.current.position.y = initialTongueY + (targetTongueY - initialTongueY) * easeProgress;
        tongueRef.current.position.z = initialTongueZ + (targetTongueZ - initialTongueZ) * easeProgress;
        tongueRef.current.rotation.x = initialTongueRotX + (targetTongueRotX - initialTongueRotX) * easeProgress;
        
        // Set tongue visibility
        tongueRef.current.visible = tongueVisible || tonguePosition > 0.5;
      }
      
      // Teeth positions
      if (teethUpperRef.current && teethLowerRef.current) {
        teethUpperRef.current.position.y = mouthHeight/2 - 0.05;
        teethLowerRef.current.position.y = -0.05 + jawRef.current.position.y;
        
        // Set teeth visibility
        teethUpperRef.current.visible = teethVisible || openness > 0.3;
        teethLowerRef.current.visible = teethVisible || openness > 0.3;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [mouthWidth, mouthHeight, openness, roundness, tonguePosition, tongueHeight, jawDrop, lipCurve, lipThickness, teethVisible, tongueVisible]);

  return (
    <group position={[0, 0, 0]}>
      {/* Face background - subtle oval shape */}
      <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ffe0d0" />
      </mesh>
      
      {/* Mouth cavity (dark inside) */}
      <mesh position={[0, 0, -0.15]}>
        <sphereGeometry args={[mouthWidth/2 - 0.05, mouthHeight/2, 0.4, 16, 16]} />
        <meshStandardMaterial color="#5c0f22" />
      </mesh>
      
      {/* Upper lip with natural curve */}
      <mesh ref={upperLipRef}>
        <cylinderGeometry args={[lipThickness*1.1, lipThickness, 0.3, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#e08a8a" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Jaw group - contains lower lip and lower teeth that move together */}
      <group ref={jawRef}>
        {/* Lower lip with natural curve */}
        <mesh ref={lowerLipRef} position={[0, -mouthHeight/2 - lipThickness/4, 0]}>
          <cylinderGeometry args={[lipThickness, lipThickness*1.1, 0.3, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#d07777" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Teeth (lower) - moves with jaw */}
        <mesh ref={teethLowerRef} position={[0, -mouthHeight/2 + 0.05, 0.05]}>
          <boxGeometry args={[mouthWidth - 0.2, 0.12, 0.1]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>
      
      {/* Tongue - more natural curved shape */}
      <mesh ref={tongueRef}>
        <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ff9a9a" />
      </mesh>
      
      {/* Teeth (upper) - fixed to upper jaw */}
      <mesh ref={teethUpperRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[mouthWidth - 0.2, 0.12, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
};

export const LipSyncMouth: React.FC<LipSyncMouthProps> = ({ word, isAnimating, phoneme }) => {
  const [mouthShape, setMouthShape] = useState(PHONEME_SHAPES["default"]);
  const [currentPhoneme, setCurrentPhoneme] = useState("");
  const [instructionText, setInstructionText] = useState("");
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
    const phonemeDuration = 600; // ms per phoneme (increased for better visibility)
    
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
        
        // Set educational instruction for this phoneme
        setInstructionText(
          PHONEME_NOTES[nextPhoneme as keyof typeof PHONEME_NOTES] || 
          PHONEME_NOTES["default"]
        );
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
      
      // Set educational instruction for this phoneme
      setInstructionText(
        PHONEME_NOTES[phoneme as keyof typeof PHONEME_NOTES] || 
        PHONEME_NOTES["default"]
      );
    }
  }, [phoneme]);

  return (
    <div className="mouth-model-container relative w-full h-full min-h-[180px] rounded-lg overflow-hidden bg-gradient-to-b from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900">
      <div className="phoneme-indicator text-xs font-mono text-center absolute top-1 left-0 right-0 z-10 bg-black/20 text-white py-0.5">
        {currentPhoneme && `Phoneme: ${currentPhoneme}`}
      </div>
      
      {/* Educational instruction text */}
      {instructionText && (
        <div className="instruction-text text-xs text-center absolute bottom-1 left-0 right-0 z-10 bg-black/20 text-white py-0.5 px-2">
          {instructionText}
        </div>
      )}
      
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, 5]} intensity={0.4} color="#ffe0c0" />
        <EnhancedMouthModel
          openness={mouthShape.openness} 
          roundness={mouthShape.roundness} 
          tonguePosition={mouthShape.tonguePosition || 0.3}
          tongueHeight={mouthShape.tongueHeight || 0.2}
          jawDrop={mouthShape.jawDrop || 0.1}
          lipThickness={mouthShape.lipThickness}
          teethVisible={mouthShape.teethVisible}
          tongueVisible={mouthShape.tongueVisible}
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
