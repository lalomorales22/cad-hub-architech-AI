
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
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <StatsOverview />
            
            {/* Projects Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
              <ProjectGrid />
            </div>

            {/* AI Tools Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setShowAIGenerator(true)}
                  className="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                >
                  <h4 className="font-semibold mb-2">AI Generator</h4>
                  <p className="text-sm opacity-90">Generate 3D models with AI</p>
                </button>
                <button 
                  onClick={() => setShowAIAgent(true)}
                  className="p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
                >
                  <h4 className="font-semibold mb-2">AI Agent</h4>
                  <p className="text-sm opacity-90">Intelligent design assistant</p>
                </button>
                <button 
                  onClick={() => setShowChat(true)}
                  className="p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                >
                  <h4 className="font-semibold mb-2">Chat Assistant</h4>
                  <p className="text-sm opacity-90">Get help and guidance</p>
                </button>
                <button 
                  onClick={() => setShowImporter(true)}
                  className="p-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left"
                >
                  <h4 className="font-semibold mb-2">Model Importer</h4>
                  <p className="text-sm opacity-90">Import existing models</p>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6">
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                <p className="text-sm text-muted-foreground">5 models generated today</p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <h4 className="font-semibold mb-2">Storage Used</h4>
                <p className="text-sm text-muted-foreground">2.4 GB of 10 GB</p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <h4 className="font-semibold mb-2">Collaboration</h4>
                <p className="text-sm text-muted-foreground">3 team members active</p>
              </div>
            </div>
          </div>
        );
      
      case 'workspace':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-border">
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
            <div className="flex-1 w-full">
              <ThreeJSCanvas cadData={cadData} />
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            <ProjectGrid />
          </div>
        );
      
      case 'files':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">File Manager</h2>
            <div className="text-center text-gray-500 mt-20">
              File management interface coming soon...
            </div>
          </div>
        );
      
      case 'templates':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Templates</h2>
            <TemplateLibrary />
          </div>
        );
      
      case 'text-to-cad':
        return (
          <div className="w-full h-full">
            <TextToCAD />
          </div>
        );
      
      case 'image-to-cad':
        return (
          <div className="w-full h-full">
            <ImageToCAD />
          </div>
        );
      
      case 'blueprint-generator':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Blueprint Generator</h2>
            <div className="max-w-7xl mx-auto">
              <BlueprintGenerator />
            </div>
          </div>
        );
      
      case 'structural-analysis':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Structural Analysis</h2>
            <div className="max-w-7xl mx-auto">
              <StructuralAnalysis />
            </div>
          </div>
        );
      
      case 'code-checker':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Code Compliance</h2>
            <div className="max-w-7xl mx-auto">
              <CodeChecker />
            </div>
          </div>
        );
      
      case 'cost-estimator':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Cost Estimator</h2>
            <div className="max-w-7xl mx-auto">
              <CostEstimator />
            </div>
          </div>
        );
      
      case 'parametric-studio':
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Parametric Design Studio</h2>
            <div className="max-w-7xl mx-auto">
              <ParametricStudio />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="w-full h-full overflow-y-auto">
            <SettingsPage />
          </div>
        );
      
      case 'help':
        return (
          <div className="w-full h-full overflow-y-auto">
            <HelpPage />
          </div>
        );
      
      case 'profile':
        return (
          <div className="w-full h-full overflow-y-auto">
            <ProfilePage />
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-border">
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
            <div className="flex-1 w-full">
              <ThreeJSCanvas cadData={cadData} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      {renderMainContent()}

      {/* Advanced AI Widget */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] w-full mx-4 overflow-hidden relative">
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
