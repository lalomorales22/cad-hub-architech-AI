
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Plus, Edit, Trash } from "lucide-react";
import { mockProjects, DatabaseManager } from "@/lib/database";
import { useState } from "react";
import { ProjectDialog } from "@/components/ProjectDialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors = {
  draft: "bg-gray-500/20 text-gray-400",
  'in-progress': "bg-blue-500/20 text-blue-400",
  review: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400"
};

const typeColors = {
  residential: "bg-purple-500/20 text-purple-400",
  commercial: "bg-cyan-500/20 text-cyan-400",
  industrial: "bg-orange-500/20 text-orange-400",
  institutional: "bg-emerald-500/20 text-emerald-400"
};

export const ProjectGrid = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteProject, setDeleteProject] = useState<any>(null);

  const handleProjectCreated = (newProject: any) => {
    const projectWithId = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProjects.push(projectWithId);
    setProjects([...mockProjects]);
    setShowNewProjectDialog(false);
  };

  const handleProjectUpdated = (updatedProject: any) => {
    const index = mockProjects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      mockProjects[index] = { ...updatedProject, updatedAt: new Date().toISOString() };
      setProjects([...mockProjects]);
    }
    setEditingProject(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteProject) {
      const index = mockProjects.findIndex(p => p.id === deleteProject.id);
      if (index !== -1) {
        mockProjects.splice(index, 1);
        setProjects([...mockProjects]);
      }
      setDeleteProject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Project Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
          <p className="text-gray-400">Manage your architectural projects</p>
        </div>
        <Button
          onClick={() => setShowNewProjectDialog(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ContextMenu key={project.id}>
            <ContextMenuTrigger asChild>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg font-medium line-clamp-1">
                      {project.name}
                    </CardTitle>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${statusColors[project.status]}`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${typeColors[project.type]}`}>
                      {project.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-400">
                      <MapPin className="h-3 w-3 mr-2" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="h-3 w-3 mr-2" />
                      {project.client}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-3 w-3 mr-2" />
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    {project.budget && (
                      <div className="flex items-center text-gray-400">
                        <DollarSign className="h-3 w-3 mr-2" />
                        ${project.budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{project.area.toLocaleString()} sq ft</span>
                      <span>ID: {project.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            
            <ContextMenuContent className="bg-gray-800 border-gray-700 text-white">
              <ContextMenuItem
                onClick={() => setEditingProject(project)}
                className="hover:bg-gray-700 cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setDeleteProject(project)}
                className="hover:bg-red-600 cursor-pointer text-red-400"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Project
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {/* New Project Dialog */}
      <ProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={handleProjectCreated}
      />

      {/* Edit Project Dialog */}
      <ProjectDialog
        open={!!editingProject}
        onOpenChange={() => setEditingProject(null)}
        onSave={handleProjectUpdated}
        project={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
