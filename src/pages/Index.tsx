
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MainWorkspace } from "@/components/MainWorkspace";
import { TopBar } from "@/components/TopBar";

const Index = () => {
  const [activeProject, setActiveProject] = useState("Ocean Beach Residence");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Apply theme to the root container
  const themeClasses = theme === 'light' 
    ? 'bg-gray-50' 
    : 'bg-gray-900';

  return (
    <div className={`min-h-screen flex overflow-hidden ${themeClasses}`}>
      <Sidebar 
        collapsed={sidebarCollapsed}
        activeProject={activeProject}
        onProjectSelect={setActiveProject}
        onNavigate={setCurrentView}
        currentView={currentView}
        theme={theme}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeProject={activeProject}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />
        
        <MainWorkspace 
          activeProject={activeProject} 
          currentView={currentView}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Index;
