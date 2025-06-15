
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
  activeProject: string;
}

export const TopBar = ({ onToggleSidebar, activeProject }: TopBarProps) => {
  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white"
        >
          ☰
        </Button>
        
        <div className="text-white font-medium">
          TEXT-TO-CAD
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Sun className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            +
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            ↑
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            ↓
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            🗑
          </Button>
        </div>
      </div>
    </div>
  );
};
