import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
  Download,
  AlertCircle,
  FileDown
} from "lucide-react";
import { ThreeJSCanvas } from "./ThreeJSCanvas";
import { aiService, CADGenerationResult } from "../services/aiServices";

export const TextToCAD = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [complexity, setComplexity] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<CADGenerationResult | null>(null);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    id: number;
    prompt: string;
    timestamp: string;
    status: string;
    result?: CADGenerationResult;
  }>>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your CAD model");
      return;
    }
    
    const openAIKey = localStorage.getItem('openai_api_key');
    if (!openAIKey) {
      toast.error("OpenAI API key required. Please add it in Settings.");
      return;
    }
    
    setIsGenerating(true);
    
    const historyItem = {
      id: Date.now(),
      prompt,
      timestamp: "just now",
      status: "generating"
    };
    
    setGenerationHistory(prev => [historyItem, ...prev]);
    
    try {
      const result = await aiService.generateCADFromText({
        prompt,
        style,
        complexity
      });
      
      setCurrentGeneration(result);
      setGenerationHistory(prev => 
        prev.map(item => 
          item.id === historyItem.id 
            ? { ...item, status: "completed", result }
            : item
        )
      );
      setPrompt("");
      toast.success("CAD model generated successfully!");
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationHistory(prev => 
        prev.map(item => 
          item.id === historyItem.id 
            ? { ...item, status: "failed" }
            : item
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const loadGeneration = (result: CADGenerationResult) => {
    setCurrentGeneration(result);
    toast.success("CAD model loaded");
  };

  const handleSaveModel = () => {
    if (!currentGeneration) {
      toast.error("No model to save");
      return;
    }

    const modelData = {
      ...currentGeneration,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cad-model-${currentGeneration.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Model saved as JSON file");
  };

  const handleExportSTL = () => {
    if (!currentGeneration) {
      toast.error("No model to export");
      return;
    }

    // Simple STL export (basic implementation)
    let stlContent = "solid model\n";
    
    currentGeneration.shapes.forEach((shape) => {
      if (shape.type === 'cube') {
        // Generate basic cube triangles for STL
        const { x, y, z } = shape.position;
        const { x: sx, y: sy, z: sz } = shape.scale;
        
        // This is a simplified cube - in a real implementation you'd generate proper triangular faces
        stlContent += `  facet normal 0 0 1\n`;
        stlContent += `    outer loop\n`;
        stlContent += `      vertex ${x-sx/2} ${y-sy/2} ${z+sz/2}\n`;
        stlContent += `      vertex ${x+sx/2} ${y-sy/2} ${z+sz/2}\n`;
        stlContent += `      vertex ${x+sx/2} ${y+sy/2} ${z+sz/2}\n`;
        stlContent += `    endloop\n`;
        stlContent += `  endfacet\n`;
      }
    });
    
    stlContent += "endsolid model\n";

    const blob = new Blob([stlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cad-model-${currentGeneration.id}.stl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Model exported as STL file");
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
        {/* API Key Status */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${localStorage.getItem('openai_api_key') ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-300">
              {localStorage.getItem('openai_api_key') ? 'OpenAI Connected' : 'API Key Required'}
            </span>
          </div>
          {!localStorage.getItem('openai_api_key') && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Add OpenAI API key in Settings
            </p>
          )}
        </div>

        {/* Generation Controls */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">Generation Settings</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-300 text-sm">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Complexity</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
                      className={`text-xs ${
                        item.status === 'completed' ? 'bg-green-600/20 text-green-400' : 
                        item.status === 'generating' ? 'bg-yellow-600/20 text-yellow-400' :
                        item.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">{item.prompt}</p>
                  {item.result && (
                    <Button
                      size="sm"
                      onClick={() => loadGeneration(item.result!)}
                      className="h-6 bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                    >
                      Load Model
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {generationHistory.length === 0 && (
              <div className="text-center py-4">
                <Zap className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No generations yet</p>
              </div>
            )}
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
            {currentGeneration && (
              <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                Model Loaded
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {currentGeneration && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSaveModel}
                  className="text-gray-400 hover:text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save JSON
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleExportSTL}
                  className="text-gray-400 hover:text-white"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Export STL
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-gray-900">
          <ThreeJSCanvas cadData={currentGeneration} />
          
          {/* Canvas Overlay Info */}
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <div className="text-white text-sm font-medium">
              {currentGeneration ? currentGeneration.description : "Text-to-CAD Generation"}
            </div>
            <div className="text-gray-400 text-xs">
              {currentGeneration ? `Generated ${currentGeneration.metadata.timestamp}` : "Ready for generation"}
            </div>
          </div>

          {/* Generation Status */}
          {isGenerating && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                <div>
                  <div className="text-white font-medium">Generating CAD Model</div>
                  <div className="text-gray-400 text-sm">Processing with AI...</div>
                </div>
              </div>
            </div>
          )}

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
                  disabled={!prompt.trim() || isGenerating || !localStorage.getItem('openai_api_key')}
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
