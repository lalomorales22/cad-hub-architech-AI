import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Box,
  Home,
  TreePine,
  Sofa,
  Lightbulb,
  Car,
  ArrowUp,
  Square,
  Ruler,
  Move3D,
  RotateCcw,
  Copy,
  Trash2,
  Download,
  WandSparkles,
  Upload,
  Layers,
  Grid3X3,
  Settings,
  FileText
} from "lucide-react";

interface EnhancedToolPaletteProps {
  theme: 'dark' | 'light';
  onToolSelect: (tool: string) => void;
  onAIGenerate: () => void;
  onImportModel: () => void;
  onDocumentationGenerate?: () => void;
}

export const EnhancedToolPalette = ({ theme, onToolSelect, onAIGenerate, onImportModel, onDocumentationGenerate }: EnhancedToolPaletteProps) => {
  const [activeCategory, setActiveCategory] = useState("basic");
  const [selectedTool, setSelectedTool] = useState("select");

  const toolCategories = {
    basic: {
      label: "Basic Shapes",
      tools: [
        { id: "select", icon: Move3D, label: "Select", desc: "Select and move objects" },
        { id: "cube", icon: Box, label: "Cube", desc: "Create cube" },
        { id: "cylinder", icon: Box, label: "Cylinder", desc: "Create cylinder" },
        { id: "sphere", icon: Box, label: "Sphere", desc: "Create sphere" },
        { id: "plane", icon: Box, label: "Plane", desc: "Create plane" },
      ]
    },
    architecture: {
      label: "Architecture",
      tools: [
        { id: "wall", icon: Home, label: "Wall", desc: "Create walls" },
        { id: "door", icon: Square, label: "Door", desc: "Add doors" },
        { id: "window", icon: Grid3X3, label: "Window", desc: "Add windows" },
        { id: "stairs", icon: ArrowUp, label: "Stairs", desc: "Create stairs" },
        { id: "roof", icon: Home, label: "Roof", desc: "Add roof" },
      ]
    },
    furniture: {
      label: "Furniture",
      tools: [
        { id: "chair", icon: Sofa, label: "Chair", desc: "Add chair" },
        { id: "table", icon: Sofa, label: "Table", desc: "Add table" },
        { id: "bed", icon: Sofa, label: "Bed", desc: "Add bed" },
        { id: "cabinet", icon: Sofa, label: "Cabinet", desc: "Add cabinet" },
        { id: "sofa", icon: Sofa, label: "Sofa", desc: "Add sofa" },
      ]
    },
    landscape: {
      label: "Landscape",
      tools: [
        { id: "tree", icon: TreePine, label: "Tree", desc: "Add trees" },
        { id: "bush", icon: TreePine, label: "Bush", desc: "Add bushes" },
        { id: "path", icon: TreePine, label: "Path", desc: "Create paths" },
        { id: "water", icon: TreePine, label: "Water", desc: "Add water features" },
        { id: "terrain", icon: TreePine, label: "Terrain", desc: "Modify terrain" },
      ]
    },
    utilities: {
      label: "Utilities",
      tools: [
        { id: "light", icon: Lightbulb, label: "Light", desc: "Add lighting" },
        { id: "camera", icon: Settings, label: "Camera", desc: "Set camera view" },
        { id: "measure", icon: Ruler, label: "Measure", desc: "Measure distances" },
        { id: "grid", icon: Grid3X3, label: "Grid", desc: "Toggle grid" },
        { id: "layers", icon: Layers, label: "Layers", desc: "Manage layers" },
      ]
    }
  };

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    onToolSelect(toolId);
  };

  const themeClasses = theme === 'light'
    ? 'bg-white border-stone-200 text-black'
    : 'bg-gray-800 border-gray-700 text-white';

  const buttonTheme = theme === 'light'
    ? 'hover:bg-stone-50'
    : 'hover:bg-gray-700';

  // Tool sections use lighter background
  const toolSectionBg = theme === 'light'
    ? 'bg-stone-50'
    : 'bg-gray-700';

  return (
    <Card className={`w-72 h-full ${themeClasses}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Design Tools</h3>
          <Badge variant="secondary" className="text-xs">Pro</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* AI and Import Tools */}
        <div className="px-4 pb-3 space-y-2">
          <Button
            onClick={onAIGenerate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
            size="sm"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            AI Generate
          </Button>
          <Button
            onClick={onImportModel}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Model
          </Button>
          <Button
            onClick={onDocumentationGenerate}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            2D Documentation
          </Button>
        </div>

        <Separator />

        {/* Tool Categories */}
        <div className={`mx-4 my-3 rounded-lg ${toolSectionBg} p-3`}>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
              <TabsTrigger value="architecture" className="text-xs">Arch</TabsTrigger>
              <TabsTrigger value="furniture" className="text-xs">Furn</TabsTrigger>
            </TabsList>

            {Object.entries(toolCategories).slice(0, 3).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-3">
                <div className="space-y-1">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon;
                    const isSelected = selectedTool === tool.id;
                    
                    return (
                      <Button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        variant={isSelected ? "default" : "ghost"}
                        className={`w-full justify-start h-10 ${!isSelected ? buttonTheme : ''}`}
                        size="sm"
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">{tool.label}</div>
                          <div className="text-xs opacity-70">{tool.desc}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Separator />

        {/* Additional Categories */}
        <div className={`mx-4 my-3 rounded-lg ${toolSectionBg} p-3`}>
          <div className="text-xs font-semibold mb-2 opacity-70">MORE TOOLS</div>
          <div className="space-y-1">
            {Object.entries(toolCategories).slice(3).map(([key, category]) => (
              <Button
                key={key}
                onClick={() => setActiveCategory(key)}
                variant="ghost"
                className={`w-full justify-start ${buttonTheme}`}
                size="sm"
              >
                <div className="text-left">
                  <div className="text-sm font-medium">{category.label}</div>
                  <div className="text-xs opacity-70">{category.tools.length} tools</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Tools */}
        <div className={`mx-4 my-3 rounded-lg ${toolSectionBg} p-3`}>
          <div className="text-xs font-semibold mb-2 opacity-70">ACTIONS</div>
          <div className="space-y-1">
            {[
              { id: "copy", icon: Copy, label: "Duplicate" },
              { id: "rotate", icon: RotateCcw, label: "Rotate" },
              { id: "delete", icon: Trash2, label: "Delete" },
              { id: "export", icon: Download, label: "Export Scene" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  onClick={() => handleToolClick(action.id)}
                  variant="ghost"
                  className={`w-full justify-start ${buttonTheme}`}
                  size="sm"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
