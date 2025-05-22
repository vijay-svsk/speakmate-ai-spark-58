
import React, { useEffect, useState } from 'react';

interface SpaceStar {
  id: number;
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  type: 'twinkle' | 'shooting' | 'pulse';
}

interface SpacePlanet {
  id: number;
  size: number;
  top: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  rotate: number;
}

export const SpaceBackground: React.FC = () => {
  const [stars, setStars] = useState<SpaceStar[]>([]);
  const [planets, setPlanets] = useState<SpacePlanet[]>([]);

  useEffect(() => {
    // Generate stars
    const newStars: SpaceStar[] = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.7 + 0.3,
      type: Math.random() > 0.9 
        ? 'shooting'
        : Math.random() > 0.7 
          ? 'pulse'
          : 'twinkle'
    }));
    
    setStars(newStars);
    
    // Generate planets
    const newPlanets: SpacePlanet[] = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 20,
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      color: getRandomColor(),
      delay: Math.random() * 2,
      duration: Math.random() * 20 + 40,
      rotate: Math.random() * 360
    }));
    
    setPlanets(newPlanets);
  }, []);
  
  const getRandomColor = () => {
    const colors = [
      'from-purple-500/30 to-indigo-600/20',
      'from-blue-500/30 to-teal-400/20',
      'from-amber-400/30 to-orange-500/20',
      'from-rose-500/30 to-pink-400/20',
      'from-emerald-500/30 to-green-400/20',
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${
            star.type === 'shooting' 
              ? 'animate-shooting-star' 
              : star.type === 'pulse' 
                ? 'animate-pulse-light' 
                : 'animate-twinkle'
          }`}
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: star.opacity,
            backgroundColor: 'white',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      
      {/* Planets - distant background decorations */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className={`absolute rounded-full bg-gradient-to-br ${planet.color} animate-float blur-md`}
          style={{
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            top: `${planet.top}%`,
            left: `${planet.left}%`,
            transform: `rotate(${planet.rotate}deg)`,
            animationDelay: `${planet.delay}s`,
            animationDuration: `${planet.duration}s`,
            opacity: 0.4,
          }}
        />
      ))}
      
      {/* Nebula effect */}
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

export const FloatingElements: React.FC = () => {
  return (
    <>
      <div className="fixed top-20 right-10 w-20 h-20 rounded-full bg-primary/10 animate-float blur-lg"></div>
      <div className="fixed bottom-20 left-10 w-32 h-32 rounded-full bg-accent/10 animate-float blur-lg" style={{ animationDelay: '1.5s' }}></div>
      <div className="fixed top-1/3 left-1/4 w-16 h-16 rounded-full bg-primary/5 animate-float blur-lg" style={{ animationDelay: '2s' }}></div>
    </>
  );
};
