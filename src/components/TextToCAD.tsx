
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Zap, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Grid,
  Layers,
  Settings,
  Save,
  Download
} from "lucide-react";
import { ThreeJSCanvas } from "./ThreeJSCanvas";

export const TextToCAD = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([
    { id: 1, prompt: "Create a modern two-story house with large windows", timestamp: "2 min ago", status: "completed" },
    { id: 2, prompt: "Add a garage to the left side", timestamp: "5 min ago", status: "completed" },
    { id: 3, prompt: "Design a minimalist office building", timestamp: "1 hour ago", status: "completed" }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGenerationHistory([
        { id: Date.now(), prompt, timestamp: "just now", status: "completed" },
        ...generationHistory
      ]);
      setPrompt("");
      setIsGenerating(false);
    }, 3000);
  };

  const toolbarTools = [
    { name: "Select", icon: Square, active: true },
    { name: "Line", icon: Minus, active: false },
    { name: "Rectangle", icon: Square, active: false },
    { name: "Circle", icon: Circle, active: false },
    { name: "Triangle", icon: Triangle, active: false },
  ];

  const viewTools = [
    { name: "Zoom In", icon: ZoomIn },
    { name: "Zoom Out", icon: ZoomOut },
    { name: "Reset View", icon: RotateCcw },
    { name: "Grid", icon: Grid },
    { name: "Layers", icon: Layers },
  ];

  return (
    <div className="h-full flex bg-gray-900">
      {/* Left Panel - History & Tools */}
      <div className="w-80 border-r border-gray-700 bg-gray-800/30 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">Drawing Tools</h3>
          <div className="grid grid-cols-5 gap-2">
            {toolbarTools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                size="sm"
                className={`h-10 w-10 p-0 ${tool.active ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* View Controls */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">View Controls</h3>
          <div className="grid grid-cols-3 gap-2">
            {viewTools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                size="sm"
                className="h-8 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <tool.icon className="h-3 w-3 mr-1" />
                <span className="text-xs">{tool.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Generation History */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">Generation History</h3>
          <div className="space-y-3">
            {generationHistory.map((item) => (
              <Card key={item.id} className="bg-gray-700/50 border-gray-600">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${item.status === 'completed' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="h-14 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-semibold">Text-to-CAD Workspace</h2>
            <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-400">
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-gray-900">
          <ThreeJSCanvas />
          
          {/* Canvas Overlay Info */}
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <div className="text-white text-sm font-medium">Active Project</div>
            <div className="text-gray-400 text-xs">Text-to-CAD Generation</div>
          </div>

          {/* Grid Info */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
            <div className="text-gray-400 text-xs">Grid: 1m | Units: Metric</div>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="h-32 bg-gray-800/50 border-t border-gray-700 p-4">
          <div className="h-full flex space-x-4">
            <div className="flex-1 flex flex-col">
              <label className="text-sm text-gray-400 mb-2">Describe what you want to create:</label>
              <div className="flex-1 flex space-x-3">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a modern residential building with large glass windows and a flat roof..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleGenerate();
                    }
                  }}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press Ctrl+Enter to generate • Use natural language to describe your architectural vision
          </div>
        </div>
      </div>
    </div>
  );
};
