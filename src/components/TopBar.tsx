
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
  Settings,
  Bell,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  onToggleSidebar: () => void;
  activeProject: string;
}

export const TopBar = ({ onToggleSidebar, activeProject }: TopBarProps) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700"></div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
