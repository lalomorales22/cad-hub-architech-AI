
import React, { useState } from 'react';
import { AdvancedAIWidget } from './AdvancedAIWidget';
import { AIAgent } from './AIAgent';
import { Chat } from './Chat';
import { ModelImporter } from './ModelImporter';
import { ProjectGrid } from './ProjectGrid';
import { TemplateLibrary } from './TemplateLibrary';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { ProfilePage } from './ProfilePage';
import { TextToCAD } from './TextToCAD';
import { ImageToCAD } from './ImageToCAD';
import { BlueprintGenerator } from './BlueprintGenerator';
import { StructuralAnalysis } from './StructuralAnalysis';
import { CodeChecker } from './CodeChecker';
import { CostEstimator } from './CostEstimator';
import { ParametricStudio } from './ParametricStudio';

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

  // Render different content based on currentView
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectGrid />
            </div>
          </div>
        );
      
      case 'workspace':
        return (
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
        );
      
      case 'projects':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            <ProjectGrid />
          </div>
        );
      
      case 'files':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">File Manager</h2>
            <div className="text-center text-gray-500">
              File management interface coming soon...
            </div>
          </div>
        );
      
      case 'templates':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Templates</h2>
            <TemplateLibrary />
          </div>
        );
      
      case 'text-to-cad':
        return <TextToCAD />;
      
      case 'image-to-cad':
        return <ImageToCAD />;
      
      case 'blueprint-generator':
        return <BlueprintGenerator />;
      
      case 'structural-analysis':
        return <StructuralAnalysis />;
      
      case 'code-checker':
        return <CodeChecker />;
      
      case 'cost-estimator':
        return <CostEstimator />;
      
      case 'parametric-studio':
        return <ParametricStudio />;
      
      case 'settings':
        return <SettingsPage />;
      
      case 'help':
        return <HelpPage />;
      
      case 'profile':
        return <ProfilePage />;
      
      default:
        return (
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
        );
    }
  };

  return (
    <div className="relative h-full">
      {renderMainContent()}

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
