
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Square, 
  Circle, 
  Triangle, 
  Move, 
  RotateCw, 
  Copy, 
  Trash2, 
  Ruler, 
  Grid3x3,
  Layers,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

const tools = [
  { name: 'Select', icon: Move, key: 'V' },
  { name: 'Rectangle', icon: Square, key: 'R' },
  { name: 'Circle', icon: Circle, key: 'C' },
  { name: 'Line', icon: Ruler, key: 'L' },
  { name: 'Rotate', icon: RotateCw, key: 'O' },
  { name: 'Copy', icon: Copy, key: 'Ctrl+C' },
  { name: 'Delete', icon: Trash2, key: 'Del' },
  { name: 'Grid', icon: Grid3x3, key: 'G' }
];

const layers = [
  { name: 'Floor Plan', visible: true, locked: false },
  { name: 'Walls', visible: true, locked: false },
  { name: 'Doors & Windows', visible: true, locked: false },
  { name: 'Furniture', visible: false, locked: false },
  { name: 'Dimensions', visible: true, locked: true },
  { name: 'Grid', visible: true, locked: true }
];

export const ToolPalette = () => {
  const [selectedTool, setSelectedTool] = useState('Select');
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(layers.map(layer => [layer.name, layer.visible]))
  );

  const toggleLayerVisibility = (layerName: string) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  return (
    <div className="w-64 space-y-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant={selectedTool === tool.name ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === tool.name 
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setSelectedTool(tool.name)}
              >
                <tool.icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{tool.name}</span>
                <span className="text-xs opacity-60">{tool.key}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {layers.map((layer) => (
              <div key={layer.name} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                <span className="text-white text-sm">{layer.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                  onClick={() => toggleLayerVisibility(layer.name)}
                >
                  {layerVisibility[layer.name] ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
