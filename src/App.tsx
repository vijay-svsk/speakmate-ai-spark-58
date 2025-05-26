
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Speaking from "./pages/Speaking";
import Pronunciation from "./pages/Pronunciation";
import InteractiveFace from "./pages/InteractiveFace";
import MirrorPractice from "./pages/MirrorPractice";
import Story from "./pages/Story";
import Conversation from "./pages/Conversation";
import Progress from "./pages/Progress";
import WordPuzzle from "./pages/WordPuzzle";
import Reflex from "./pages/Reflex";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/grammar" element={<Grammar />} />
              <Route path="/speaking" element={<Speaking />} />
              <Route path="/pronunciation" element={<Pronunciation />} />
              <Route path="/interactive-face" element={<InteractiveFace />} />
              <Route path="/mirror-practice" element={<MirrorPractice />} />
              <Route path="/story" element={<Story />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/word-puzzle" element={<WordPuzzle />} />
              <Route path="/reflex" element={<Reflex />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
