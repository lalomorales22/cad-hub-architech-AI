
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FolderOpen, 
  Plus, 
  Image, 
  Settings, 
  HelpCircle,
  Bell,
  Clock
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  activeProject: string;
  onProjectSelect: (project: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Sidebar = ({ collapsed, activeProject, onProjectSelect, onNavigate, currentView }: SidebarProps) => {
  const menuItems = [
    { 
      title: "WORKSPACE", 
      items: [
        { name: "Dashboard", icon: Home, view: "dashboard", active: currentView === "dashboard", notifications: 0 },
        { name: "Projects", icon: FolderOpen, view: "projects", active: currentView === "projects", notifications: 3 },
        { name: "Recent Files", icon: Clock, view: "files", active: currentView === "files", notifications: 0 }
      ] 
    },
    { 
      title: "CREATE", 
      items: [
        { name: "Text-to-CAD", icon: Plus, view: "text-to-cad", active: currentView === "text-to-cad", notifications: 0 },
        { name: "Image-to-CAD", icon: Image, view: "image-to-cad", active: currentView === "image-to-cad", notifications: 0 }
      ] 
    },
    { 
      title: "TOOLS", 
      items: [
        { name: "Settings", icon: Settings, view: "settings", active: currentView === "settings", notifications: 0 },
        { name: "Help", icon: HelpCircle, view: "help", active: currentView === "help", notifications: 0 }
      ] 
    }
  ];

  return (
    <div className={cn(
      "bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Logo/Brand */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CH</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider">CAD HUB</h1>
              <p className="text-xs text-gray-400">Professional Edition</p>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Navigation Menu */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-2">
            {!collapsed && (
              <h3 className="text-gray-400 text-xs font-semibold tracking-wider px-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => onNavigate(item.view)}
                  className={cn(
                    "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/60",
                    collapsed ? "px-2 justify-center" : "px-3",
                    item.active && "bg-gray-800/80 text-white"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.notifications > 0 && (
                        <Badge variant="secondary" className="bg-cyan-600 text-white text-xs px-1.5 py-0">
                          {item.notifications}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-gray-800" />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-semibold">
              CH
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-white font-medium">Corey Hilton</p>
              <p className="text-gray-400 text-sm">Senior Architect</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
