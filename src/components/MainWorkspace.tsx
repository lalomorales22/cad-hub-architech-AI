
import { useState } from "react";
import { ThreeJSCanvas } from "@/components/ThreeJSCanvas";
import { Chat } from "@/components/Chat";
import { ProjectGrid } from "@/components/ProjectGrid";
import { RecentFiles } from "@/components/RecentFiles";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { StatsOverview } from "@/components/StatsOverview";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { EnhancedToolPalette } from "@/components/EnhancedToolPalette";
import { AIGenerationWidget } from "@/components/AIGenerationWidget";
import { SceneManager } from "@/components/SceneManager";
import { TextToCAD } from "@/components/TextToCAD";
import { ImageToCAD } from "@/components/ImageToCAD";
import { BlueprintGenerator } from "@/components/BlueprintGenerator";
import { StructuralAnalysis } from "@/components/StructuralAnalysis";
import { CodeChecker } from "@/components/CodeChecker";
import { CostEstimator } from "@/components/CostEstimator";
import { ParametricStudio } from "@/components/ParametricStudio";
import { SettingsPage } from "@/components/SettingsPage";
import { HelpPage } from "@/components/HelpPage";
import { ProfilePage } from "@/components/ProfilePage";
import { ModelImporter } from "@/components/ModelImporter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Upload, Save, Download, Layers, Settings, RotateCcw, ZoomIn, WandSparkles } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { toast } from "sonner";

interface MainWorkspaceProps {
  activeProject: string;
  currentView: string;
  theme: 'dark' | 'light';
}

interface SceneObject {
  id: string;
  name: string;
  type: string;
  category: 'basic' | 'architecture' | 'furniture' | 'landscape' | 'ai-generated';
  visible: boolean;
  locked: boolean;
  position: { x: number; y: number; z: number };
  cadData?: any;
}

export const MainWorkspace = ({ activeProject, currentView, theme }: MainWorkspaceProps) => {
  const [showChat, setShowChat] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  const [selectedTool, setSelectedTool] = useState("select");
  const [cadData, setCadData] = useState(null);
  
  const { getCurrentProjectId } = useProject();

  // Apply theme classes to the workspace
  const themeClasses = theme === 'light' 
    ? 'bg-gray-50 text-gray-900' 
    : 'bg-gray-900 text-white';

  const handleImportModel = (modelData: any) => {
    const newObject: SceneObject = {
      id: crypto.randomUUID(),
      name: `Imported Model ${sceneObjects.length + 1}`,
      type: modelData.type || 'imported',
      category: 'basic',
      visible: true,
      locked: false,
      position: { x: 0, y: 0, z: 0 },
      cadData: modelData
    };
    
    setSceneObjects(prev => [...prev, newObject]);
    toast.success("Model imported successfully!");
    setShowImporter(false);
  };

  const handleAIGenerate = (aiCadData: any) => {
    const newObject: SceneObject = {
      id: crypto.randomUUID(),
      name: aiCadData.description || `AI Generated ${sceneObjects.length + 1}`,
      type: 'ai-generated',
      category: 'ai-generated',
      visible: true,
      locked: false,
      position: { x: 0, y: 0, z: 0 },
      cadData: aiCadData
    };
    
    setSceneObjects(prev => [...prev, newObject]);
    setCadData(aiCadData); // Update the main canvas
    setShowAIGenerator(false);
    toast.success("AI generated model added to scene!");
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    
    // Handle basic shape creation
    if (['cube', 'sphere', 'cylinder', 'plane'].includes(tool)) {
      const newObject: SceneObject = {
        id: crypto.randomUUID(),
        name: `${tool.charAt(0).toUpperCase() + tool.slice(1)} ${sceneObjects.length + 1}`,
        type: tool,
        category: 'basic',
        visible: true,
        locked: false,
        position: { x: 0, y: 0, z: 0 },
        cadData: {
          id: crypto.randomUUID(),
          description: `Basic ${tool}`,
          coordinates: [],
          shapes: [{
            type: tool,
            position: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }],
          metadata: {
            prompt: `Basic ${tool}`,
            timestamp: new Date().toISOString(),
            model: 'user-created'
          }
        }
      };
      
      setSceneObjects(prev => [...prev, newObject]);
      setCadData(newObject.cadData);
      toast.success(`${tool} added to scene`);
    }
  };

  const handleObjectUpdate = (id: string, updates: Partial<SceneObject>) => {
    setSceneObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  const handleObjectDelete = (id: string) => {
    setSceneObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(undefined);
    }
    toast.success("Object deleted");
  };

  const handleSaveScene = () => {
    const projectId = getCurrentProjectId();
    if (projectId) {
      // Here you would save to your database/storage
      console.log('Saving scene for project:', projectId, sceneObjects);
      toast.success("Scene saved successfully!");
    }
  };

  const handleExportScene = () => {
    const sceneData = {
      project: activeProject,
      objects: sceneObjects,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(sceneData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.replace(/\s+/g, '_')}_scene.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Scene exported!");
  };

  // Render different views based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="h-full p-6 space-y-6 overflow-y-auto">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProjectGrid />
              </div>
              <div>
                <ProjectTimeline />
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                All Projects
              </h2>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                Manage and organize your architectural projects
              </p>
            </div>
            <ProjectGrid />
          </div>
        );

      case "files":
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                File Manager
              </h2>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                Access and manage your project files
              </p>
            </div>
            <RecentFiles />
          </div>
        );

      case "templates":
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Template Library
              </h2>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                Start new projects with professional templates
              </p>
            </div>
            <TemplateLibrary />
          </div>
        );

      case "text-to-cad":
        return <TextToCAD />;

      case "image-to-cad":
        return <ImageToCAD />;

      case "blueprint-generator":
        return <BlueprintGenerator />;

      case "structural-analysis":
        return <StructuralAnalysis />;

      case "code-checker":
        return <CodeChecker />;

      case "cost-estimator":
        return <CostEstimator />;

      case "parametric-studio":
        return <ParametricStudio />;

      case "settings":
        return <SettingsPage />;

      case "help":
        return <HelpPage />;

      case "profile":
        return <ProfilePage />;

      case "workspace":
        return (
          <div className="h-full flex">
            {/* Left Panel - Enhanced Tool Palette */}
            <div className="flex-shrink-0">
              <EnhancedToolPalette
                theme={theme}
                onToolSelect={handleToolSelect}
                onAIGenerate={() => setShowAIGenerator(true)}
                onImportModel={() => setShowImporter(true)}
              />
            </div>
            
            {/* Main 3D Canvas Area - Takes up most space */}
            <div className="flex-1 min-w-0 p-4">
              <div className={`h-full rounded-xl border relative overflow-hidden ${
                theme === 'light' 
                  ? 'bg-gray-100/30 border-gray-300' 
                  : 'bg-gray-800/30 border-gray-700'
              }`}>
                <ThreeJSCanvas cadData={cadData} />
                
                {/* Enhanced Project Info Overlay */}
                <Card className={`absolute top-6 left-6 backdrop-blur-sm border ${
                  theme === 'light'
                    ? 'bg-white/90 border-gray-300'
                    : 'bg-gray-900/90 border-gray-700'
                } p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {activeProject}
                      </h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        3D Design Studio
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {sceneObjects.length} objects
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedTool}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Enhanced Action Toolbar */}
                <div className={`absolute top-6 right-6 flex gap-2`}>
                  <Button
                    onClick={() => setShowAIGenerator(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white backdrop-blur-sm"
                    size="sm"
                  >
                    <WandSparkles className="mr-2 h-4 w-4" />
                    AI Generate
                  </Button>
                  
                  <Button
                    onClick={handleSaveScene}
                    variant="secondary"
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Scene
                  </Button>
                  
                  <Button
                    onClick={handleExportScene}
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                {/* View Controls */}
                <div className={`absolute bottom-6 right-6 flex flex-col gap-2`}>
                  {[
                    { icon: RotateCcw, label: "Reset View" },
                    { icon: ZoomIn, label: "Fit All" },
                    { icon: Layers, label: "Wireframe" },
                    { icon: Settings, label: "Render Settings" },
                  ].map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      variant="secondary"
                      size="sm"
                      className="backdrop-blur-sm"
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Scene Manager */}
            <div className="flex-shrink-0">
              <SceneManager
                theme={theme}
                objects={sceneObjects}
                selectedObjectId={selectedObjectId}
                onObjectUpdate={handleObjectUpdate}
                onObjectDelete={handleObjectDelete}
                onObjectSelect={setSelectedObjectId}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Coming Soon
              </h2>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                This feature is under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 relative ${themeClasses}`}>
      <div className="h-full">
        {renderCurrentView()}
      </div>

      {/* Enhanced Chat Toggle */}
      <Button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition-all transform hover:scale-105 z-50"
        title="Open AI Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* AI Generation Widget */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AIGenerationWidget
            onGenerate={handleAIGenerate}
            onClose={() => setShowAIGenerator(false)}
            theme={theme}
          />
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
