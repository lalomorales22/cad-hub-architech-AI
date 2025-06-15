
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Box, Home, TreePine, Sofa, Move3D } from "lucide-react";

interface ToolPaletteProps {
  onToolSelect?: (tool: string) => void;
}

export const ToolPalette = ({ onToolSelect }: ToolPaletteProps) => {
  const tools = [
    { id: "select", icon: Move3D, label: "Select" },
    { id: "cube", icon: Box, label: "Cube" },
    { id: "wall", icon: Home, label: "Wall" },
    { id: "tree", icon: TreePine, label: "Tree" },
    { id: "furniture", icon: Sofa, label: "Furniture" },
  ];

  return (
    <Card className="w-20 bg-gray-800 border-gray-700">
      <CardContent className="p-2 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant="ghost"
              size="sm"
              className="w-full h-12 flex flex-col items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => onToolSelect?.(tool.id)}
              title={tool.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{tool.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
