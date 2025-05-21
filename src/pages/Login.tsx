
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSound } from "@/lib/useSound";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";
import confetti from 'canvas-confetti';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { playSound, isMuted, toggleMute } = useSound();
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Play sound when the component mounts
    playSound('valid');
    
    // Add floating animations
    const interval = setInterval(() => {
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((el) => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        (el as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [playSound]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just show confetti and navigate
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    playSound('valid');
    setTimeout(() => navigate('/'), 1000);
  };

  const handleElementHover = (element: string) => {
    setHoveredElement(element);
    playSound('keypress');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4 relative overflow-hidden">
      {/* Floating elements */}
      <img src="https://cdn.pixabay.com/photo/2016/04/01/09/24/book-1299643_1280.png" 
        alt="Book" 
        className="floating-element absolute w-20 h-20 top-20 left-[10%] opacity-60 transition-all duration-1000" />
      
      <img src="https://cdn.pixabay.com/photo/2013/07/13/10/17/pen-156869_1280.png" 
        alt="Pen" 
        className="floating-element absolute w-16 h-16 top-40 right-[15%] opacity-60 transition-all duration-1000" />
      
      <img src="https://cdn.pixabay.com/photo/2016/03/31/15/31/alphabet-1293108_1280.png" 
        alt="Letters" 
        className="floating-element absolute w-24 h-24 bottom-20 left-[20%] opacity-60 transition-all duration-1000" />

      {/* Navigation back */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          onMouseEnter={() => handleElementHover('back')}
          onMouseLeave={() => setHoveredElement(null)}
          className={`rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300 ${
            hoveredElement === 'back' ? 'animate-pulse' : ''
          }`}
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
      </div>

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          onMouseEnter={() => handleElementHover('sound')}
          onMouseLeave={() => setHoveredElement(null)}
          className={`rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300 ${
            hoveredElement === 'sound' ? 'animate-pulse' : ''
          }`}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-primary" />
          ) : (
            <Volume2 className="h-6 w-6 text-primary" />
          )}
        </Button>
      </div>

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-bounce-light">
          Echo.ai
        </h1>
        <p className="text-muted-foreground mt-2">Learning is fun with Echo.ai!</p>
      </div>

      <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/20 hover:border-primary/50 transition-all duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => playSound('keypress')}
                className="border-primary/20 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent-dark transition-colors"
                  onMouseEnter={() => handleElementHover('forgot')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => playSound('keypress')}
                className="border-primary/20 focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark hover:scale-105 transition-all duration-300"
              onMouseEnter={() => handleElementHover('login')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center w-full">
            <span className="text-muted-foreground">New here? </span>
            <Link
              to="/register"
              className="text-accent hover:text-accent-dark hover:underline transition-colors"
              onMouseEnter={() => handleElementHover('register')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 animate-float">
        <div className="bg-primary/10 p-4 rounded-full">
          <img 
            src="https://cdn.pixabay.com/photo/2021/03/11/07/39/child-6086010_1280.png" 
            alt="Learning kid" 
            className="w-24 h-24 object-contain" 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
