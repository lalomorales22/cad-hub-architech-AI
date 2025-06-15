
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed: boolean;
  activeProject: string;
  onProjectSelect: (project: string) => void;
}

export const Sidebar = ({ collapsed, activeProject, onProjectSelect }: SidebarProps) => {
  const menuItems = [
    { title: "CREATE.", items: ["Text-to-CAD"] },
    { title: "GENERATE.", items: ["Image-to-CAD"] },
    { title: "MY FILES.", items: [] }
  ];

  return (
    <div className={cn(
      "bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo/Brand */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          {collapsed ? "CH" : "CAD HUB"}
        </h1>
      </div>

      <Separator className="bg-gray-800" />

      {/* Navigation Menu */}
      <div className="flex-1 p-4 space-y-6">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-2">
            {!collapsed && (
              <h3 className="text-gray-400 text-sm font-medium tracking-wide">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                    collapsed && "px-2"
                  )}
                >
                  {collapsed ? item.charAt(0) : item}
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
            <AvatarFallback className="bg-gray-700 text-white">CH</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <p className="text-white font-medium">Corey</p>
              <p className="text-gray-400 text-sm">Hilton</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
