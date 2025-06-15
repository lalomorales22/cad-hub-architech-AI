
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
import { ThreeJSCanvas } from './ThreeJSCanvas';
import { StatsOverview } from './StatsOverview';

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
  const [cadData, setCadData] = useState(null);

  const handleAIGenerate = (cadData: any) => {
    console.log('AI Generated CAD data:', cadData);
    setCadData(cadData);
    setShowAIGenerator(false);
    setShowAIAgent(false);
  };

  const handleImportModel = (modelData: any) => {
    console.log('Imported model data:', modelData);
    setCadData(modelData);
    setShowImporter(false);
  };

  // Render different content based on currentView
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectGrid />
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setShowAIGenerator(true)}
                      className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      AI Generator
                    </button>
                    <button 
                      onClick={() => setShowAIAgent(true)}
                      className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      AI Agent
                    </button>
                    <button 
                      onClick={() => setShowChat(true)}
                      className="p-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Chat Assistant
                    </button>
                    <button 
                      onClick={() => setShowImporter(true)}
                      className="p-3 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                    >
                      Import Model
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'workspace':
        return (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">3D CAD Workspace</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAIGenerator(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    AI Generator
                  </button>
                  <button 
                    onClick={() => setShowAIAgent(true)}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    AI Agent
                  </button>
                  <button 
                    onClick={() => setShowChat(true)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Chat
                  </button>
                  <button 
                    onClick={() => setShowImporter(true)}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ThreeJSCanvas cadData={cadData} />
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
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">3D CAD Workspace</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAIGenerator(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    AI Generator
                  </button>
                  <button 
                    onClick={() => setShowAIAgent(true)}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    AI Agent
                  </button>
                  <button 
                    onClick={() => setShowChat(true)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Chat
                  </button>
                  <button 
                    onClick={() => setShowImporter(true)}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ThreeJSCanvas cadData={cadData} />
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
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden relative">
            <button
              onClick={() => setShowAIGenerator(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 z-10 text-2xl font-bold"
            >
              ×
            </button>
            <AdvancedAIWidget
              onGenerate={handleAIGenerate}
              onClose={() => setShowAIGenerator(false)}
              theme="light"
            />
          </div>
        </div>
      )}

      {/* AI Agent */}
      {showAIAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden relative">
            <button
              onClick={() => setShowAIAgent(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 z-10 text-2xl font-bold"
            >
              ×
            </button>
            <AIAgent
              theme="light"
              onGenerateComplete={handleAIGenerate}
            />
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
