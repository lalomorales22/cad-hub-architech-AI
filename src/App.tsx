
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gray-900">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
