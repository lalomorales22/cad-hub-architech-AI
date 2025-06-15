
import { useState } from "react";
import { ThreeJSCanvas } from "@/components/ThreeJSCanvas";
import { AIChat } from "@/components/AIChat";
import { ProjectCard } from "@/components/ProjectCard";

interface MainWorkspaceProps {
  activeProject: string;
}

export const MainWorkspace = ({ activeProject }: MainWorkspaceProps) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex-1 bg-gray-900 relative">
      {/* Main 3D Workspace */}
      <div className="h-full flex">
        {/* Left panels - wireframe models */}
        <div className="w-1/3 p-6 space-y-6">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-2">📐</div>
              <p>2D Floor Plan</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-2">🏗️</div>
              <p>3D Wireframe</p>
            </div>
          </div>
        </div>

        {/* Center - 3D Canvas */}
        <div className="flex-1 p-6">
          <div className="h-full bg-gray-800/30 rounded-xl border border-gray-700 relative overflow-hidden">
            <ThreeJSCanvas />
            
            {/* Project Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <ProjectCard 
                title={activeProject}
                description="Modern two-story residence with clean lines and large windows"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors z-50"
      >
        💬
      </button>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-40">
          <AIChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};
