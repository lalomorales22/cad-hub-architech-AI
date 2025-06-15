
import { useState } from "react";
import { ThreeJSCanvas } from "@/components/ThreeJSCanvas";
import { AIChat } from "@/components/AIChat";
import { ProjectGrid } from "@/components/ProjectGrid";
import { RecentFiles } from "@/components/RecentFiles";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { StatsOverview } from "@/components/StatsOverview";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ToolPalette } from "@/components/ToolPalette";
import { TextToCAD } from "@/components/TextToCAD";
import { ImageToCAD } from "@/components/ImageToCAD";
import { SettingsPage } from "@/components/SettingsPage";
import { HelpPage } from "@/components/HelpPage";
import { ProfilePage } from "@/components/ProfilePage";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MainWorkspaceProps {
  activeProject: string;
  currentView: string;
}

export const MainWorkspace = ({ activeProject, currentView }: MainWorkspaceProps) => {
  const [showChat, setShowChat] = useState(false);

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
              <h2 className="text-2xl font-bold text-white mb-2">All Projects</h2>
              <p className="text-gray-400">Manage and organize your architectural projects</p>
            </div>
            <ProjectGrid />
          </div>
        );

      case "files":
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">File Manager</h2>
              <p className="text-gray-400">Access and manage your project files</p>
            </div>
            <RecentFiles />
          </div>
        );

      case "templates":
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Template Library</h2>
              <p className="text-gray-400">Start new projects with professional templates</p>
            </div>
            <TemplateLibrary />
          </div>
        );

      case "text-to-cad":
        return <TextToCAD />;

      case "image-to-cad":
        return <ImageToCAD />;

      case "settings":
        return <SettingsPage />;

      case "help":
        return <HelpPage />;

      case "profile":
        return <ProfilePage />;

      case "workspace":
        return (
          <div className="h-full flex">
            <ToolPalette />
            <div className="flex-1 p-6">
              <div className="h-full bg-gray-800/30 rounded-xl border border-gray-700 relative overflow-hidden">
                <ThreeJSCanvas />
                
                {/* Project Info Overlay */}
                <div className="absolute top-6 left-6 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold">{activeProject}</h3>
                  <p className="text-gray-400 text-sm">3D Modeling Workspace</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="text-gray-400">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-gray-900 relative">
      <div className="h-full">
        {renderCurrentView()}
      </div>

      {/* AI Chat Toggle */}
      <Button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition-all transform hover:scale-105 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl z-40">
          <AIChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};
