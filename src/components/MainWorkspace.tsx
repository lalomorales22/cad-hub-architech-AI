
import { useState } from "react";
import { ThreeJSCanvas } from "@/components/ThreeJSCanvas";
import { AIChat } from "@/components/AIChat";
import { ProjectGrid } from "@/components/ProjectGrid";
import { RecentFiles } from "@/components/RecentFiles";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { StatsOverview } from "@/components/StatsOverview";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ToolPalette } from "@/components/ToolPalette";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, LayoutGrid, Files, BookOpen, BarChart3, Wrench } from "lucide-react";

interface MainWorkspaceProps {
  activeProject: string;
}

export const MainWorkspace = ({ activeProject }: MainWorkspaceProps) => {
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex-1 bg-gray-900 relative">
      <div className="h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-6 pt-4 pb-2 border-b border-gray-800">
            <TabsList className="bg-gray-800/50 text-gray-400">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Files className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="workspace" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Wrench className="h-4 w-4 mr-2" />
                3D Workspace
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="dashboard" className="h-full p-6 space-y-6 overflow-y-auto">
              <StatsOverview />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProjectGrid />
                </div>
                <div>
                  <ProjectTimeline />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="h-full p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">All Projects</h2>
                <p className="text-gray-400">Manage and organize your architectural projects</p>
              </div>
              <ProjectGrid />
            </TabsContent>

            <TabsContent value="files" className="h-full p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">File Manager</h2>
                <p className="text-gray-400">Access and manage your project files</p>
              </div>
              <RecentFiles />
            </TabsContent>

            <TabsContent value="templates" className="h-full p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Template Library</h2>
                <p className="text-gray-400">Start new projects with professional templates</p>
              </div>
              <TemplateLibrary />
            </TabsContent>

            <TabsContent value="workspace" className="h-full flex">
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
            </TabsContent>
          </div>
        </Tabs>
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
