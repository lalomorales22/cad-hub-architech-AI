
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MainWorkspace } from "@/components/MainWorkspace";
import { TopBar } from "@/components/TopBar";

const Index = () => {
  const [activeProject, setActiveProject] = useState("Ocean Beach Residence");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-900 flex overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed}
        activeProject={activeProject}
        onProjectSelect={setActiveProject}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeProject={activeProject}
        />
        
        <MainWorkspace 
          activeProject={activeProject} 
          currentView={currentView}
        />
      </div>
    </div>
  );
};

export default Index;
