
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  Save, 
  Upload, 
  Download, 
  Share2,
  Bell,
  Github,
  HardDrive,
  FileText,
  FolderPlus,
  File
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface TopBarProps {
  onToggleSidebar: () => void;
  activeProject: string;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export const TopBar = ({ onToggleSidebar, activeProject, theme, onThemeToggle }: TopBarProps) => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleSave = () => {
    console.log("Saving project:", activeProject);
    // Implement save functionality
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.cad,.dwg,.step';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Importing file:", file.name);
        // Implement import functionality
      }
    };
    input.click();
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      console.log("Creating new project:", newProjectName);
      setNewProjectName("");
      setShowNewProjectDialog(false);
      // Implement project creation
    }
  };

  const notifications = [
    { id: 1, title: "Project updated", message: "Ocean Beach Residence has been updated", time: "2 min ago" },
    { id: 2, title: "Render complete", message: "Your 3D render is ready for download", time: "5 min ago" },
    { id: 3, title: "Collaboration invite", message: "John invited you to Modern Villa project", time: "1 hour ago" }
  ];

  return (
    <div className="h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <div className="flex flex-col space-y-1">
            <div className="w-4 h-0.5 bg-current"></div>
            <div className="w-4 h-0.5 bg-current"></div>
            <div className="w-4 h-0.5 bg-current"></div>
          </div>
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="text-white font-semibold text-lg">CAD HUB</div>
          <Badge variant="secondary" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs">
            PRO
          </Badge>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
          <span>/</span>
          <span className="text-white">{activeProject}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects, files..."
            className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {/* New Project/File Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem 
                onClick={() => setShowNewProjectDialog(true)}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <File className="h-4 w-4 mr-2" />
                New File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            title="Save Project"
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImport}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            title="Import File"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          {/* Download/Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                title="Download/Export"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <File className="h-4 w-4 mr-2" />
                Export as DWG
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <HardDrive className="h-4 w-4 mr-2" />
                Export as STEP
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Share Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                title="Share Project"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Github className="h-4 w-4 mr-2" />
                Share to GitHub
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <HardDrive className="h-4 w-4 mr-2" />
                Share to Google Drive
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Download Copy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-px h-6 bg-gray-700"></div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={onThemeToggle}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{notifications.length}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700 w-80">
            <div className="p-2">
              <h3 className="text-white font-medium mb-2">Notifications</h3>
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 hover:bg-gray-700 rounded-md mb-1">
                  <div className="text-white text-sm font-medium">{notification.title}</div>
                  <div className="text-gray-400 text-xs">{notification.message}</div>
                  <div className="text-gray-500 text-xs mt-1">{notification.time}</div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowNewProjectDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject}
                className="bg-cyan-600 hover:bg-cyan-500"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
