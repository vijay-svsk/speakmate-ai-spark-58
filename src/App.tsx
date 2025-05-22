import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Speaking from "./pages/Speaking";
import Pronunciation from "./pages/Pronunciation";
import Story from "./pages/Story";
import Conversation from "./pages/Conversation";
import Grammar from "./pages/Grammar";
import Vocabulary from "./pages/Vocabulary";
import Reflex from "./pages/Reflex";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import WordPuzzle from "./pages/WordPuzzle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MirrorPractice from "./pages/MirrorPractice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/story" element={<Story />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/reflex" element={<Reflex />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/word-puzzle" element={<WordPuzzle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mirror-practice" element={<MirrorPractice />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
