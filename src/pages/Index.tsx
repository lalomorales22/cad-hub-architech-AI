
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MainWorkspace } from "@/components/MainWorkspace";
import { useProject } from "@/contexts/ProjectContext";

const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const { currentProject, setCurrentProject } = useProject();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleProjectSelect = (project: string) => {
    setCurrentProject(project);
    console.log(`Switched to project: ${project}`);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const containerClasses = theme === 'light' 
    ? 'bg-gray-50 text-gray-900' 
    : 'bg-gray-900 text-white';

  return (
    <div className={`h-screen flex flex-col ${containerClasses}`}>
      <TopBar 
        onToggleSidebar={handleToggleSidebar} 
        activeProject={currentProject}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          collapsed={collapsed}
          activeProject={currentProject}
          onProjectSelect={handleProjectSelect}
          onNavigate={handleNavigate}
          currentView={currentView}
          theme={theme}
        />
        <MainWorkspace 
          activeProject={currentProject}
          currentView={currentView}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Index;
