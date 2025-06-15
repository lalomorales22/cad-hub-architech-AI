
import React, { useState } from 'react';
import { AdvancedAIWidget } from './AdvancedAIWidget';
import { AIAgent } from './AIAgent';
import { Chat } from './Chat';
import { ModelImporter } from './ModelImporter';

interface MainWorkspaceProps {
  theme: 'dark' | 'light';
  activeProject?: string;
  currentView?: string;
}

export const MainWorkspace = ({ theme, activeProject, currentView }: MainWorkspaceProps) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  const handleAIGenerate = (cadData: any) => {
    console.log('AI Generated CAD data:', cadData);
    setShowAIGenerator(false);
  };

  const handleImportModel = (modelData: any) => {
    console.log('Imported model data:', modelData);
    setShowImporter(false);
  };

  return (
    <div className="relative h-full">
      {/* Main workspace content would go here */}
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">3D CAD Workspace</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowAIGenerator(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              AI Generator
            </button>
            <button 
              onClick={() => setShowAIAgent(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              AI Agent
            </button>
            <button 
              onClick={() => setShowChat(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Chat
            </button>
            <button 
              onClick={() => setShowImporter(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Import Model
            </button>
          </div>
        </div>
      </div>

      {/* Advanced AI Widget */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AdvancedAIWidget
            onGenerate={handleAIGenerate}
            onClose={() => setShowAIGenerator(false)}
            theme={theme}
          />
        </div>
      )}

      {/* AI Agent */}
      {showAIAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
            <AIAgent
              theme={theme}
              onGenerateComplete={handleAIGenerate}
            />
            <button
              onClick={() => setShowAIAgent(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] shadow-2xl z-40">
          <Chat onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* Model Importer */}
      {showImporter && (
        <ModelImporter
          onImport={handleImportModel}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
};
