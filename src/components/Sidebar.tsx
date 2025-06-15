
import { useState } from "react";
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
  Clock,
  User
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  activeProject: string;
  onProjectSelect: (project: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
  theme: 'dark' | 'light';
}

export const Sidebar = ({ collapsed, activeProject, onProjectSelect, onNavigate, currentView, theme }: SidebarProps) => {
  const [showProfile, setShowProfile] = useState(false);

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

  // Theme-based styles
  const sidebarBg = theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-950 border-gray-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const separatorColor = theme === 'light' ? 'bg-gray-200' : 'bg-gray-800';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800/60';
  const activeBg = theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800/80 text-white';

  return (
    <div className={cn(
      "border-r flex flex-col transition-all duration-300 relative",
      sidebarBg,
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
              <h1 className={`text-xl font-bold tracking-wider ${textPrimary}`}>CAD HUB</h1>
              <p className={`text-xs ${textMuted}`}>Professional Edition</p>
            </div>
          )}
        </div>
      </div>

      <Separator className={separatorColor} />

      {/* Navigation Menu */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-2">
            {!collapsed && (
              <h3 className={`text-xs font-semibold tracking-wider px-2 ${textMuted}`}>
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
                    `w-full justify-start ${textSecondary} ${hoverBg}`,
                    collapsed ? "px-2 justify-center" : "px-3",
                    item.active && activeBg
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

      <Separator className={separatorColor} />

      {/* User Profile */}
      <div className="p-4">
        <div 
          className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${hoverBg}`}
          onClick={() => setShowProfile(!showProfile)}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-semibold">
              CH
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1">
              <p className={`font-medium ${textPrimary}`}>Corey Hilton</p>
              <p className={`text-sm ${textMuted}`}>Senior Architect</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              className={`${textSecondary} hover:${textPrimary}`}
            >
              <Bell className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && !collapsed && (
        <div className={`absolute bottom-20 left-4 right-4 border rounded-lg shadow-xl z-50 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="p-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${textSecondary} ${hoverBg}`}
              onClick={() => {
                onNavigate("profile");
                setShowProfile(false);
              }}
            >
              <User className="h-4 w-4 mr-3" />
              View Profile
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${textSecondary} ${hoverBg}`}
              onClick={() => {
                onNavigate("settings");
                setShowProfile(false);
              }}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            <Separator className={`${separatorColor} my-2`} />
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-400 hover:text-red-300 ${
                theme === 'light' ? 'hover:bg-red-50' : 'hover:bg-red-900/20'
              }`}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
