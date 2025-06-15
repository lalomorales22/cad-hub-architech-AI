
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Zap, Play, RefreshCw, Download, Settings, Eye } from "lucide-react";
import { ParametricDesignViewer } from "@/components/ParametricDesignViewer";
import { aiService } from "@/services/aiServices";
import { fileService } from "@/services/fileServices";
import { toast } from "sonner";

export const ParametricStudio = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [parameters, setParameters] = useState({
    buildingHeight: [25],
    floorArea: [3000],
    windowRatio: [30],
    roofPitch: [6],
    setbacks: [15]
  });
  const [designType, setDesignType] = useState("residential");
  const [variations, setVariations] = useState<any[]>([]);

  const handleParameterChange = (param: string, value: number[]) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const generateVariations = async () => {
    setIsGenerating(true);
    try {
      // Generate multiple design variations using AI
      const basePrompt = `Generate ${designType} building variations with height ${parameters.buildingHeight[0]}ft, area ${parameters.floorArea[0]} sqft, ${parameters.windowRatio[0]}% windows, roof pitch ${parameters.roofPitch[0]}/12, setbacks ${parameters.setbacks[0]}ft`;
      
      const aiResults = await Promise.all([
        aiService.generateCADFromText({ 
          prompt: `${basePrompt}. Modern minimalist style`, 
          style: "modern",
          complexity: "high" 
        }),
        aiService.generateCADFromText({ 
          prompt: `${basePrompt}. Traditional classic style`, 
          style: "traditional",
          complexity: "high" 
        }),
        aiService.generateCADFromText({ 
          prompt: `${basePrompt}. Contemporary eco-friendly style`, 
          style: "contemporary",
          complexity: "high" 
        })
      ]);
      
      const mockVariations = [
        {
          id: 1,
          name: "Modern Minimalist",
          preview: "🏠",
          aiData: aiResults[0],
          parameters: {
            height: parameters.buildingHeight[0],
            area: parameters.floorArea[0],
            windows: parameters.windowRatio[0],
            pitch: parameters.roofPitch[0]
          },
          score: 8.5,
          efficiency: "High",
          cost: Math.round(parameters.floorArea[0] * 180),
          features: ["Open floor plan", "Large windows", "Flat roof sections", "Minimal exterior details"]
        },
        {
          id: 2,
          name: "Traditional Classic", 
          preview: "🏘️",
          aiData: aiResults[1],
          parameters: {
            height: parameters.buildingHeight[0] * 1.1,
            area: parameters.floorArea[0] * 0.95,
            windows: parameters.windowRatio[0] * 0.8,
            pitch: parameters.roofPitch[0] * 1.3
          },
          score: 7.8,
          efficiency: "Medium",
          cost: Math.round(parameters.floorArea[0] * 195),
          features: ["Classic proportions", "Traditional materials", "Steep roof pitch", "Symmetrical design"]
        },
        {
          id: 3,
          name: "Eco Contemporary",
          preview: "🌿", 
          aiData: aiResults[2],
          parameters: {
            height: parameters.buildingHeight[0] * 0.9,
            area: parameters.floorArea[0] * 1.05,
            windows: parameters.windowRatio[0] * 1.2,
            pitch: parameters.roofPitch[0] * 0.7
          },
          score: 9.2,
          efficiency: "Very High",
          cost: Math.round(parameters.floorArea[0] * 210),
          features: ["Green roof system", "Solar integration", "Natural ventilation", "Sustainable materials"]
        }
      ];

      setVariations(mockVariations);
      toast.success("AI-powered design variations generated!");
    } catch (error) {
      console.error('Variation generation error:', error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDesign = (design: any) => {
    setSelectedDesign(design);
  };

  const handleDownloadDesign = async (design: any) => {
    if (design.aiData) {
      await fileService.exportFile({
        format: 'glb',
        filename: `parametric_${design.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        data: design.aiData
      });
    }
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case "Very High": return "bg-green-600";
      case "High": return "bg-blue-600";
      case "Medium": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Parametric Design Studio</h2>
        <p className="text-gray-400">Create and explore design variations with AI-powered parametric modeling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Design Parameters
            </CardTitle>
            <CardDescription>Adjust parameters to explore design space</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">Design Type</Label>
              <select
                value={designType}
                onChange={(e) => setDesignType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="mixed-use">Mixed Use</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-white">Building Height</Label>
                  <span className="text-gray-400 text-sm">{parameters.buildingHeight[0]} ft</span>
                </div>
                <Slider
                  value={parameters.buildingHeight}
                  onValueChange={(value) => handleParameterChange('buildingHeight', value)}
                  max={100}
                  min={15}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-white">Floor Area</Label>
                  <span className="text-gray-400 text-sm">{parameters.floorArea[0]} sq ft</span>
                </div>
                <Slider
                  value={parameters.floorArea}
                  onValueChange={(value) => handleParameterChange('floorArea', value)}
                  max={8000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-white">Window Ratio</Label>
                  <span className="text-gray-400 text-sm">{parameters.windowRatio[0]}%</span>
                </div>
                <Slider
                  value={parameters.windowRatio}
                  onValueChange={(value) => handleParameterChange('windowRatio', value)}
                  max={60}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-white">Roof Pitch</Label>
                  <span className="text-gray-400 text-sm">{parameters.roofPitch[0]}/12</span>
                </div>
                <Slider
                  value={parameters.roofPitch}
                  onValueChange={(value) => handleParameterChange('roofPitch', value)}
                  max={12}
                  min={2}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-white">Setbacks</Label>
                  <span className="text-gray-400 text-sm">{parameters.setbacks[0]} ft</span>
                </div>
                <Slider
                  value={parameters.setbacks}
                  onValueChange={(value) => handleParameterChange('setbacks', value)}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={generateVariations} 
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate AI Variations
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                <Play className="mr-2 h-4 w-4" />
                Run Optimization
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">AI Design Variations</CardTitle>
              <CardDescription>AI-generated design alternatives based on your parameters</CardDescription>
            </CardHeader>
            <CardContent>
              {variations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {variations.map((variation) => (
                    <Card key={variation.id} className="bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors">
                      <CardContent className="p-4">
                        <div className="text-center mb-3">
                          <div className="text-4xl mb-2">{variation.preview}</div>
                          <h3 className="text-white font-semibold">{variation.name}</h3>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Height:</span>
                            <span className="text-white">{Math.round(variation.parameters.height)}ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Area:</span>
                            <span className="text-white">{Math.round(variation.parameters.area)}sf</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Windows:</span>
                            <span className="text-white">{Math.round(variation.parameters.windows)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cost:</span>
                            <span className="text-green-400">${variation.cost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <Badge className={getEfficiencyColor(variation.efficiency)}>
                            {variation.efficiency}
                          </Badge>
                          <div className="text-right">
                            <div className="text-white font-semibold">{variation.score}/10</div>
                            <div className="text-gray-400 text-xs">AI Score</div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-gray-400">
                          {variation.features.map((feature: string, index: number) => (
                            <div key={index}>• {feature}</div>
                          ))}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleViewDesign(variation)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-600 text-white hover:bg-gray-600"
                            onClick={() => handleDownloadDesign(variation)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Adjust parameters and generate variations to see AI-powered results</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Design Viewer Modal */}
      {selectedDesign && (
        <ParametricDesignViewer 
          design={selectedDesign}
          onClose={() => setSelectedDesign(null)}
        />
      )}
    </div>
  );
};
