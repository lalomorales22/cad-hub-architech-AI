
import { createContext, useContext, useState, ReactNode } from 'react';
import { DatabaseManager } from '@/lib/database';

interface ProjectContextType {
  currentProject: string;
  setCurrentProject: (projectName: string) => void;
  getCurrentProjectId: () => string | null;
  getCurrentProjectData: () => any | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
  initialProject?: string;
}

export const ProjectProvider = ({ children, initialProject = "Residential Complex A" }: ProjectProviderProps) => {
  const [currentProject, setCurrentProject] = useState(initialProject);

  const getCurrentProjectId = () => {
    const projects = DatabaseManager.getProjects();
    const project = projects.find(p => p.name === currentProject);
    return project?.id || null;
  };

  const getCurrentProjectData = () => {
    const projects = DatabaseManager.getProjects();
    return projects.find(p => p.name === currentProject) || null;
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      setCurrentProject,
      getCurrentProjectId,
      getCurrentProjectData
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
