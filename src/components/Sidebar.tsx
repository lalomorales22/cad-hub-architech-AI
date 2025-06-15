import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DatabaseManager } from "@/lib/database";
import { 
  Building,
  Layout,
  Box,
  Folder,
  FileText,
  Grid3X3,
  MessageSquare,
  Camera,
  Calculator,
  Shield,
  DollarSign,
  Zap,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  collapsed: boolean;
  activeProject: string;
  onProjectSelect: (project: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
  theme: 'dark' | 'light';
}

export const Sidebar = ({ collapsed, activeProject, onProjectSelect, onNavigate, currentView, theme }: SidebarProps) => {
  const projects = DatabaseManager.getProjects();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "workspace", label: "3D Workspace", icon: Box },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "files", label: "File Manager", icon: FileText },
    { id: "templates", label: "Templates", icon: Grid3X3 },
  ];

  const aiTools = [
    { id: "text-to-cad", label: "Text to CAD", icon: MessageSquare },
    { id: "image-to-cad", label: "Image to CAD", icon: Camera },
    { id: "blueprint-generator", label: "AI Blueprints", icon: FileText },
    { id: "structural-analysis", label: "Structural Analysis", icon: Calculator },
    { id: "code-checker", label: "Code Compliance", icon: Shield },
    { id: "cost-estimator", label: "Cost Estimator", icon: DollarSign },
    { id: "parametric-studio", label: "Parametric Design", icon: Zap },
  ];

  const settingsItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  const themeClasses = theme === 'light'
    ? 'bg-gray-100 text-gray-900 border-gray-300'
    : 'bg-gray-800 text-gray-300 border-gray-700';

  const sidebarClasses = theme === 'light'
    ? 'bg-white border-r'
    : 'bg-gray-900 border-r border-gray-700';

  const renderNavItem = (item: { id: string; label: string; icon: any }) => (
    <Button
      key={item.id}
      variant="ghost"
      className={`w-full justify-start ${currentView === item.id
        ? theme === 'light'
          ? 'bg-blue-100 text-blue-900'
          : 'bg-blue-900 text-blue-100'
        : theme === 'light'
          ? 'hover:bg-gray-100 text-gray-700'
          : 'hover:bg-gray-800 text-gray-300'
        }`}
      onClick={() => onNavigate(item.id)}
    >
      <item.icon className="h-4 w-4 mr-2" />
      {!collapsed && <span>{item.label}</span>}
    </Button>
  );

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ${sidebarClasses} flex flex-col`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                ArchitectAI
              </h1>
              <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                AI Design Studio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          <div className={`text-xs font-semibold mb-3 ${collapsed ? 'hidden' : 'block'} ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-wide`}>
            Navigation
          </div>
          {navItems.map((item) => renderNavItem(item))}
        </div>

        {/* AI Tools Section */}
        <div className="p-3 space-y-1">
          <div className={`text-xs font-semibold mb-3 ${collapsed ? 'hidden' : 'block'} ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-wide`}>
            AI Tools
          </div>
          {aiTools.map((item) => renderNavItem(item))}
        </div>

        {/* Active Project Section */}
        {!collapsed && (
          <div className="p-3">
            <div className={`text-xs font-semibold mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-wide`}>
              Current Project
            </div>
            <Card className={theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700'}>
              <CardHeader className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {activeProject}
                    </h3>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      In Progress
                    </p>
                  </div>
                </div>
                
                {/* Change Project Button */}
                <div className="mt-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full ${theme === 'light' 
                          ? 'border-gray-300 hover:bg-gray-200 text-gray-900' 
                          : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Change Project
                        <ChevronDown className="h-3 w-3 ml-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start" 
                      className={`w-56 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'}`}
                    >
                      {projects.map((project) => (
                        <DropdownMenuItem
                          key={project.id}
                          onClick={() => onProjectSelect(project.name)}
                          className={`cursor-pointer ${
                            project.name === activeProject
                              ? theme === 'light' 
                                ? 'bg-blue-100 text-blue-900' 
                                : 'bg-blue-900 text-blue-100'
                              : theme === 'light'
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{project.name}</span>
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {project.type} • {project.location}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="border-t border-gray-700 p-3 space-y-1">
        {settingsItems.map((item) => renderNavItem(item))}
      </div>
    </div>
  );
};
