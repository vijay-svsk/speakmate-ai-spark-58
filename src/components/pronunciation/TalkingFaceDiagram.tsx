import React, { useEffect, useState, useRef } from "react";
import { Volume2, Play, Pause, RotateCcw, Eye, EyeOff, Zap, Settings, Camera, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TalkingFaceDiagramProps {
  word: string;
  isAnimating: boolean;
  phoneme?: string;
}

// Enhanced phoneme to mouth shape mapping with more accurate lip movements
const PHONEME_MOUTH_SHAPES = {
  // Vowels - More precise mouth shapes with better lip movement
  "A": { width: 95, height: 65, lipRound: 0.1, tonguePos: "low", teethShow: true, jawDrop: 0.9, lipSeparation: 0.8 },
  "E": { width: 75, height: 40, lipRound: 0.05, tonguePos: "mid", teethShow: true, jawDrop: 0.5, lipSeparation: 0.6 },
  "I": { width: 50, height: 28, lipRound: 0.1, tonguePos: "high", teethShow: true, jawDrop: 0.3, lipSeparation: 0.4 },
  "O": { width: 45, height: 60, lipRound: 0.95, tonguePos: "mid", teethShow: false, jawDrop: 0.7, lipSeparation: 0.2 },
  "U": { width: 35, height: 50, lipRound: 0.9, tonguePos: "high", teethShow: false, jawDrop: 0.6, lipSeparation: 0.1 },
  
  // Consonants - More detailed lip movements
  "P": { width: 0, height: 0, lipRound: 0.3, tonguePos: "neutral", teethShow: false, jawDrop: 0.1, lipSeparation: 0.0 },
  "B": { width: 8, height: 8, lipRound: 0.3, tonguePos: "neutral", teethShow: false, jawDrop: 0.2, lipSeparation: 0.1 },
  "T": { width: 35, height: 18, lipRound: 0.1, tonguePos: "tip", teethShow: true, jawDrop: 0.35, lipSeparation: 0.5 },
  "D": { width: 40, height: 22, lipRound: 0.1, tonguePos: "tip", teethShow: true, jawDrop: 0.4, lipSeparation: 0.6 },
  "K": { width: 50, height: 35, lipRound: 0.2, tonguePos: "back", teethShow: false, jawDrop: 0.5, lipSeparation: 0.7 },
  "G": { width: 55, height: 40, lipRound: 0.2, tonguePos: "back", teethShow: false, jawDrop: 0.55, lipSeparation: 0.8 },
  
  // Fricatives - Enhanced precision for lip movement
  "F": { width: 60, height: 20, lipRound: 0.1, tonguePos: "neutral", teethShow: true, jawDrop: 0.3, lipSeparation: 0.3 },
  "V": { width: 60, height: 25, lipRound: 0.1, tonguePos: "neutral", teethShow: true, jawDrop: 0.35, lipSeparation: 0.4 },
  "S": { width: 45, height: 15, lipRound: 0.1, tonguePos: "tip", teethShow: true, jawDrop: 0.25, lipSeparation: 0.3 },
  "Z": { width: 45, height: 18, lipRound: 0.1, tonguePos: "tip", teethShow: true, jawDrop: 0.3, lipSeparation: 0.4 },
  "TH": { width: 55, height: 25, lipRound: 0.1, tonguePos: "between", teethShow: true, jawDrop: 0.4, lipSeparation: 0.5 },
  
  // Nasals with proper lip closure
  "M": { width: 0, height: 0, lipRound: 0.5, tonguePos: "neutral", teethShow: false, jawDrop: 0.1, lipSeparation: 0.0 },
  "N": { width: 40, height: 15, lipRound: 0.1, tonguePos: "tip", teethShow: false, jawDrop: 0.3, lipSeparation: 0.4 },
  
  // Liquids with better tongue positioning
  "L": { width: 50, height: 35, lipRound: 0.1, tonguePos: "tip", teethShow: false, jawDrop: 0.45, lipSeparation: 0.6 },
  "R": { width: 55, height: 40, lipRound: 0.3, tonguePos: "curl", teethShow: false, jawDrop: 0.5, lipSeparation: 0.7 },
  
  // Default relaxed position
  "default": { width: 50, height: 35, lipRound: 0.3, tonguePos: "neutral", teethShow: false, jawDrop: 0.35, lipSeparation: 0.5 }
};

// Enhanced word to phoneme breakdown
const getWordPhonemes = (word: string): string[] => {
  const phonemeMap: Record<string, string[]> = {
    "hello": ["H", "E", "L", "O"],
    "elephant": ["E", "L", "E", "F", "A", "N", "T"],
    "beautiful": ["B", "U", "T", "I", "F", "U", "L"],
    "together": ["T", "O", "G", "E", "TH", "E", "R"],
    "congratulations": ["K", "O", "N", "G", "R", "A", "T", "U", "L", "A", "TH", "O", "N", "S"],
    "particularly": ["P", "A", "R", "T", "I", "K", "U", "L", "A", "R", "L", "I"],
    "pronunciation": ["P", "R", "O", "N", "U", "N", "S", "I", "A", "TH", "O", "N"],
    "practice": ["P", "R", "A", "K", "T", "I", "S"],
    "fantastic": ["F", "A", "N", "T", "A", "S", "T", "I", "K"]
  };
  
  return phonemeMap[word.toLowerCase()] || word.toUpperCase().split("");
};

// Face expression modes
const FACE_EXPRESSIONS = {
  "happy": { eyeShape: "smile", cheekColor: 0.6, eyebrowAngle: 5 },
  "focused": { eyeShape: "focused", cheekColor: 0.3, eyebrowAngle: -3 },
  "relaxed": { eyeShape: "normal", cheekColor: 0.4, eyebrowAngle: 0 },
  "excited": { eyeShape: "wide", cheekColor: 0.8, eyebrowAngle: 8 }
};

export const TalkingFaceDiagram: React.FC<TalkingFaceDiagramProps> = ({
  word,
  isAnimating,
  phoneme
}) => {
  const [currentMouthShape, setCurrentMouthShape] = useState(PHONEME_MOUTH_SHAPES["default"]);
  const [currentPhoneme, setCurrentPhoneme] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState(400);
  const [showPhonemeBreakdown, setShowPhonemeBreakdown] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhonemeIndex, setCurrentPhonemeIndex] = useState(0);
  const [showTongue, setShowTongue] = useState(true);
  const [eyeExpression, setEyeExpression] = useState("normal");
  const [faceExpression, setFaceExpression] = useState("relaxed");
  const [showTeeth, setShowTeeth] = useState(true);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [slowMotionMode, setSlowMotionMode] = useState(false);
  const [highlightCurrentPhoneme, setHighlightCurrentPhoneme] = useState(true);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [showSoundWaves, setShowSoundWaves] = useState(true);
  const [jawMovement, setJawMovement] = useState(true);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const wordPhonemes = getWordPhonemes(word);

  // Enhanced animation with more realistic timing
  useEffect(() => {
    if (!isAnimating || !word || wordPhonemes.length === 0) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let phonemeIndex = 0;
    
    const animatePhonemes = () => {
      if (phonemeIndex >= wordPhonemes.length) {
        if (autoRepeat) {
          phonemeIndex = 0;
        } else {
          setIsPlaying(false);
          setEyeExpression("blink");
          setTimeout(() => setEyeExpression("normal"), 150);
          return;
        }
      }
      
      const currentP = wordPhonemes[phonemeIndex];
      setCurrentPhoneme(currentP);
      setCurrentPhonemeIndex(phonemeIndex);
      
      const shape = PHONEME_MOUTH_SHAPES[currentP as keyof typeof PHONEME_MOUTH_SHAPES] || 
                    PHONEME_MOUTH_SHAPES["default"];
      setCurrentMouthShape(shape);
      
      // Add subtle facial expression changes
      if (phonemeIndex === 0) setFaceExpression("focused");
      else if (phonemeIndex === Math.floor(wordPhonemes.length / 2)) setFaceExpression("happy");
      else if (phonemeIndex === wordPhonemes.length - 1) setFaceExpression("relaxed");
      
      phonemeIndex++;
    };

    const speed = slowMotionMode ? animationSpeed * 2 : animationSpeed;
    animatePhonemes();
    animationRef.current = setInterval(animatePhonemes, speed);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      setIsPlaying(false);
    };
  }, [isAnimating, word, animationSpeed, slowMotionMode, autoRepeat]);

  // Handle direct phoneme selection
  useEffect(() => {
    if (phoneme && !isAnimating) {
      setCurrentPhoneme(phoneme);
      const shape = PHONEME_MOUTH_SHAPES[phoneme as keyof typeof PHONEME_MOUTH_SHAPES] || 
                    PHONEME_MOUTH_SHAPES["default"];
      setCurrentMouthShape(shape);
      setEyeExpression("focused");
      setTimeout(() => setEyeExpression("normal"), 1000);
    }
  }, [phoneme, isAnimating]);

  // Enhanced tongue position calculation with better accuracy
  const getTonguePosition = () => {
    switch (currentMouthShape.tonguePos) {
      case "high": return { x: 160, y: 200, rotation: -15, width: 24, height: 10 };
      case "mid": return { x: 160, y: 215, rotation: 0, width: 28, height: 14 };
      case "low": return { x: 160, y: 235, rotation: 10, width: 32, height: 18 };
      case "tip": return { x: 150, y: 190, rotation: -22, width: 20, height: 9 };
      case "back": return { x: 170, y: 230, rotation: 15, width: 35, height: 20 };
      case "curl": return { x: 160, y: 200, rotation: -30, width: 22, height: 12 };
      case "between": return { x: 140, y: 185, rotation: -10, width: 18, height: 8 };
      default: return { x: 160, y: 220, rotation: 0, width: 28, height: 14 };
    }
  };

  const tonguePos = getTonguePosition();
  const currentExpression = FACE_EXPRESSIONS[faceExpression as keyof typeof FACE_EXPRESSIONS];

  // Reset animation
  const resetAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    setCurrentPhonemeIndex(0);
    setCurrentPhoneme("");
    setCurrentMouthShape(PHONEME_MOUTH_SHAPES["default"]);
    setIsPlaying(false);
    setFaceExpression("relaxed");
  };

  return (
    <div className="relative w-full h-full min-h-[700px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-700 shadow-2xl">
      
      {/* Advanced Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-3">
        <div className="bg-gradient-to-r from-primary/95 to-purple-600/95 text-primary-foreground px-4 py-2 rounded-2xl text-sm font-mono text-center backdrop-blur-md shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              /{currentPhoneme || "ready"}/ - {currentMouthShape.tonguePos} tongue
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTongue(!showTongue)}
                className="h-7 w-7 p-0 text-primary-foreground hover:bg-white/20 rounded-full"
                title="Toggle Tongue Visibility"
              >
                {showTongue ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMirrorMode(!mirrorMode)}
                className="h-7 w-7 p-0 text-primary-foreground hover:bg-white/20 rounded-full"
                title="Mirror Mode"
              >
                <Camera className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetAnimation}
                className="h-7 w-7 p-0 text-primary-foreground hover:bg-white/20 rounded-full"
                title="Reset Animation"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Control Panel */}
        <div className="bg-white/95 dark:bg-gray-800/95 px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Animation Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium">Speed:</span>
                <Slider
                  value={[600 - animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(600 - value[0])}
                  max={450}
                  min={100}
                  step={25}
                  className="flex-1"
                />
                <span className="text-primary font-mono w-8">{((600 - animationSpeed) / 100).toFixed(1)}x</span>
              </div>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slowMotionMode}
                    onCheckedChange={setSlowMotionMode}
                    className="scale-75"
                  />
                  <span>Slow Motion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoRepeat}
                    onCheckedChange={setAutoRepeat}
                    className="scale-75"
                  />
                  <span>Auto Repeat</span>
                </div>
              </div>
            </div>
            
            {/* Visual Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showTeeth}
                    onCheckedChange={setShowTeeth}
                    className="scale-75"
                  />
                  <span>Show Teeth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={jawMovement}
                    onCheckedChange={setJawMovement}
                    className="scale-75"
                  />
                  <span>Jaw Movement</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium">Expression:</span>
                <Select value={faceExpression} onValueChange={setFaceExpression}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="focused">Focused</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Much Larger Face Area - Significantly Increased Size */}
      <div className="absolute inset-0 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className={`w-full max-w-4xl transition-all duration-500 ${isPlaying ? 'scale-105' : 'scale-100'} ${mirrorMode ? 'scale-x-[-1]' : ''}`}>
          
          {/* Face Container with much larger sizing */}
          <div className={`bg-gradient-to-br from-white/98 to-gray-50/98 dark:from-gray-800/98 dark:to-gray-900/98 rounded-full p-12 backdrop-blur-md shadow-2xl border-4 border-gradient-to-r from-primary/30 to-purple-500/30 ${isPlaying ? 'animate-pulse' : ''}`}>
            
            {/* Much Larger Face SVG - Increased from 400x400 to 600x600 */}
            <svg
              width="600"
              height="600"
              viewBox="0 0 320 320"
              className="w-full h-full"
            >
              {/* Enhanced Face outline - Larger */}
              <defs>
                <radialGradient id="faceGradient" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#ffe8d6" />
                  <stop offset="100%" stopColor="#fdd5b8" />
                </radialGradient>
              </defs>
              
              <circle
                cx="160"
                cy="160"
                r="145"
                fill="url(#faceGradient)"
                stroke="#e0a580"
                strokeWidth="5"
                className={isPlaying ? "animate-pulse" : ""}
              />
              
              {/* Enhanced Eyes with larger sizing */}
              <g>
                <ellipse 
                  cx="115" 
                  cy="125" 
                  rx={eyeExpression === "blink" ? "20" : currentExpression.eyeShape === "wide" ? "24" : "20"} 
                  ry={eyeExpression === "blink" ? "4" : currentExpression.eyeShape === "focused" ? "28" : "24"} 
                  fill="#2d3748"
                  className="transition-all duration-200"
                />
                <ellipse 
                  cx="205" 
                  cy="125" 
                  rx={eyeExpression === "blink" ? "20" : currentExpression.eyeShape === "wide" ? "24" : "20"} 
                  ry={eyeExpression === "blink" ? "4" : currentExpression.eyeShape === "focused" ? "28" : "24"} 
                  fill="#2d3748"
                  className="transition-all duration-200"
                />
                
                {/* Enhanced Eye highlights and pupils - Larger */}
                {eyeExpression !== "blink" && (
                  <>
                    <circle cx="120" cy="118" r="8" fill="#4a5568" />
                    <circle cx="210" cy="118" r="8" fill="#4a5568" />
                    <ellipse cx="123" cy="115" rx="4" ry="5" fill="#ffffff" />
                    <ellipse cx="213" cy="115" rx="4" ry="5" fill="#ffffff" />
                    <circle cx="124" cy="116" r="1.5" fill="#ffffff" />
                    <circle cx="214" cy="116" r="1.5" fill="#ffffff" />
                  </>
                )}
              </g>
              
              {/* Enhanced Eyebrows - Larger */}
              <g className={`transition-transform duration-300 ${currentExpression.eyeShape === "focused" ? "translate-y-1" : ""}`}>
                <path
                  d="M 85 102 Q 115 92 145 102"
                  stroke="#8b4513"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  transform={`rotate(${currentExpression.eyebrowAngle} 115 97)`}
                  className="transition-transform duration-300"
                />
                <path
                  d="M 175 102 Q 205 92 235 102"
                  stroke="#8b4513"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  transform={`rotate(${-currentExpression.eyebrowAngle} 205 97)`}
                  className="transition-transform duration-300"
                />
              </g>
              
              {/* Enhanced Nose - Larger */}
              <g>
                <path
                  d="M 160 142 L 148 175 L 160 185 L 172 175 Z"
                  fill="#d4a574"
                  stroke="#c09660"
                  strokeWidth="3"
                />
                <ellipse cx="153" cy="178" rx="3" ry="4" fill="#c09660" />
                <ellipse cx="167" cy="178" rx="3" ry="4" fill="#c09660" />
              </g>
              
              {/* Much More Advanced Dynamic Mouth with precise lip movement */}
              <g transform={jawMovement ? `translate(0, ${currentMouthShape.jawDrop * 12})` : ""}>
                {/* Mouth cavity - Larger and more accurate */}
                <ellipse
                  cx="160"
                  cy="225"
                  rx={currentMouthShape.width / 2.5}
                  ry={currentMouthShape.height / 1.2}
                  fill="#722f37"
                  stroke="none"
                  className="transition-all duration-300"
                />
                
                {/* Upper lip with precise shaping */}
                <ellipse
                  cx="160"
                  cy={218 - (currentMouthShape.lipSeparation * 8)}
                  rx={currentMouthShape.width / 2.2}
                  ry="12"
                  fill="#d4888a"
                  stroke="#b87578"
                  strokeWidth="2"
                  className="transition-all duration-300"
                  transform={`rotate(${currentMouthShape.lipRound * 4} 160 218)`}
                />
                
                {/* Lower lip with precise shaping */}
                <ellipse
                  cx="160"
                  cy={232 + (currentMouthShape.lipSeparation * 8)}
                  rx={currentMouthShape.width / 2.2}
                  ry="14"
                  fill="#cc7779"
                  stroke="#a86367"
                  strokeWidth="2"
                  className="transition-all duration-300"
                  transform={`rotate(${currentMouthShape.lipRound * 4} 160 232)`}
                />
                
                {/* Main mouth opening with accurate sizing */}
                <ellipse
                  cx="160"
                  cy="225"
                  rx={currentMouthShape.width / 3}
                  ry={currentMouthShape.height / 1.5}
                  fill="#8b1538"
                  className="transition-all duration-300"
                />
                
                {/* Enhanced Teeth - Larger and more visible */}
                {showTeeth && currentMouthShape.teethShow && currentMouthShape.height > 25 && (
                  <g>
                    <rect 
                      x={160 - currentMouthShape.width / 6} 
                      y="208" 
                      width={currentMouthShape.width / 3} 
                      height="12" 
                      fill="#f8f8f8" 
                      rx="6"
                      className="transition-all duration-300"
                    />
                    {/* Individual teeth - More detailed */}
                    {[...Array(7)].map((_, i) => (
                      <rect
                        key={i}
                        x={160 - currentMouthShape.width / 6 + (i * currentMouthShape.width / 21)}
                        y="208"
                        width={currentMouthShape.width / 28}
                        height="12"
                        fill="#ffffff"
                        rx="2"
                        className="transition-all duration-300"
                      />
                    ))}
                  </g>
                )}
                
                {/* Enhanced Tongue with much more realistic positioning */}
                {showTongue && currentMouthShape.height > 15 && (
                  <ellipse
                    cx={tonguePos.x}
                    cy={tonguePos.y}
                    rx={tonguePos.width}
                    ry={tonguePos.height}
                    fill="#ff9999"
                    stroke="#ff7777"
                    strokeWidth="2"
                    className="transition-all duration-300"
                    transform={`rotate(${tonguePos.rotation} ${tonguePos.x} ${tonguePos.y})`}
                  />
                )}
                
                {/* Enhanced Lip rounding details */}
                {currentMouthShape.lipRound > 0.6 && (
                  <>
                    <ellipse
                      cx="160"
                      cy="225"
                      rx={currentMouthShape.width / 2}
                      ry={currentMouthShape.height / 1.1}
                      fill="none"
                      stroke="#d4888a"
                      strokeWidth="5"
                      className="transition-all duration-300"
                    />
                  </>
                )}
              </g>
              
              {/* Enhanced Cheeks - Larger */}
              <circle 
                cx="80" 
                cy="185" 
                r="28" 
                fill="#ffb3ba" 
                opacity={currentExpression.cheekColor}
                className="transition-opacity duration-500"
              />
              <circle 
                cx="240" 
                cy="185" 
                r="28" 
                fill="#ffb3ba" 
                opacity={currentExpression.cheekColor}
                className="transition-opacity duration-500"
              />
              
              {/* Advanced Sound waves */}
              {isPlaying && showSoundWaves && (
                <g>
                  <circle cx="200" cy="70" r="4" fill="#87ceeb" opacity="0.8">
                    <animate attributeName="r" values="4;16;4" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="220" cy="55" r="3" fill="#87ceeb" opacity="0.6">
                    <animate attributeName="r" values="3;12;3" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="235" cy="45" r="2" fill="#87ceeb" opacity="0.4">
                    <animate attributeName="r" values="2;8;2" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1s" repeatCount="indefinite" />
                  </circle>
                  {/* Musical notes */}
                  <text x="210" y="35" fill="#6366f1" fontSize="12" opacity="0.7">♪</text>
                  <text x="225" y="25" fill="#8b5cf6" fontSize="10" opacity="0.5">♫</text>
                </g>
              )}
              
              {/* Breathing indicator */}
              {!isPlaying && (
                <circle 
                  cx="50" 
                  cy="60" 
                  r="3" 
                  fill="#34d399" 
                  opacity="0.6"
                >
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Phoneme Breakdown */}
      {showPhonemeBreakdown && word && (
        <div className="absolute bottom-24 left-4 right-4 bg-white/98 dark:bg-gray-800/98 rounded-2xl p-4 backdrop-blur-md border-2 border-primary/20 shadow-xl">
          <div className="text-sm font-bold mb-3 text-center flex items-center justify-center gap-2">
            <Mic className="h-4 w-4" />
            Phoneme Sequence Analysis
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {wordPhonemes.map((p, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-xl text-sm font-mono transition-all duration-300 cursor-pointer transform ${
                  i === currentPhonemeIndex && highlightCurrentPhoneme
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground scale-110 shadow-lg rotate-1' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 hover:scale-105'
                }`}
                onClick={() => {
                  setCurrentPhoneme(p);
                  setCurrentPhonemeIndex(i);
                  const shape = PHONEME_MOUTH_SHAPES[p as keyof typeof PHONEME_MOUTH_SHAPES] || 
                                PHONEME_MOUTH_SHAPES["default"];
                  setCurrentMouthShape(shape);
                }}
              >
                <div className="font-bold">/{p}/</div>
                <div className="text-xs opacity-75">{PHONEME_MOUTH_SHAPES[p as keyof typeof PHONEME_MOUTH_SHAPES]?.tonguePos || "neutral"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Bottom Status */}
      <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black/90 to-gray-900/90 text-white text-sm p-3 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPlaying ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="font-bold">Speaking "{word}"...</span>
                </div>
                <div className="text-xs opacity-75">
                  Phoneme {currentPhonemeIndex + 1} of {wordPhonemes.length}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Ready to practice</span>
                </div>
                <div className="text-xs opacity-75">
                  Click phonemes to practice individually
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPhonemeBreakdown(!showPhonemeBreakdown)}
              className="h-6 text-white hover:bg-white/20 text-xs px-3 rounded-full"
            >
              {showPhonemeBreakdown ? "Hide" : "Show"} Analysis
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSoundWaves(!showSoundWaves)}
              className="h-6 text-white hover:bg-white/20 text-xs px-3 rounded-full"
            >
              {showSoundWaves ? "Hide" : "Show"} Waves
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Status indicators */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-gradient-to-r from-green-500/95 to-emerald-600/95 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Enhanced Pro
        </div>
        <div className="bg-gradient-to-r from-purple-500/95 to-violet-600/95 text-white px-3 py-1 rounded-full text-xs shadow-lg">
          AI Powered
        </div>
        {mirrorMode && (
          <div className="bg-gradient-to-r from-blue-500/95 to-cyan-600/95 text-white px-3 py-1 rounded-full text-xs shadow-lg">
            Mirror Mode
          </div>
        )}
        {slowMotionMode && (
          <div className="bg-gradient-to-r from-orange-500/95 to-red-600/95 text-white px-3 py-1 rounded-full text-xs shadow-lg">
            Slow Motion
          </div>
        )}
      </div>
    </div>
  );
};
