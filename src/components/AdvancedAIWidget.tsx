
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WandSparkles, Loader2, X, Zap, Eye, Cpu, Dna } from "lucide-react";
import { advancedAI } from "@/services/advancedAIServices";
import { toast } from "sonner";

interface AdvancedAIWidgetProps {
  onGenerate: (cadData: any) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const AdvancedAIWidget = ({ onGenerate, onClose, theme }: AdvancedAIWidgetProps) => {
  const [prompt, setPrompt] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("fal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  // Fal.AI specific
  const [falStyle, setFalStyle] = useState("realistic");
  const [falQuality, setFalQuality] = useState("medium");
  
  // Stability AI specific
  const [stabilityStyle, setStabilityStyle] = useState("architectural");
  const [imageSize, setImageSize] = useState("1024");
  
  // Replicate specific
  const [replicateModel, setReplicateModel] = useState("3d-generation");
  
  // DeepMind specific
  const [analysisType, setAnalysisType] = useState("stability");

  const providers = [
    { 
      id: "fal", 
      name: "Fal.AI", 
      icon: Zap, 
      description: "Real-time 3D generation",
      color: "text-purple-400"
    },
    { 
      id: "stability", 
      name: "Stability AI", 
      icon: Eye, 
      description: "Advanced image generation",
      color: "text-blue-400"
    },
    { 
      id: "replicate", 
      name: "Replicate", 
      icon: Cpu, 
      description: "ML model processing",
      color: "text-green-400"
    },
    { 
      id: "deepmind", 
      name: "DeepMind", 
      icon: Dna, 
      description: "Structural analysis",
      color: "text-orange-400"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() && !imageUrl.trim()) {
      toast.error("Please enter a description or image URL");
      return;
    }

    setIsGenerating(true);
    try {
      let result;
      
      switch (selectedProvider) {
        case 'fal':
          if (imageUrl) {
            result = await advancedAI.falAI.generateFromImage(imageUrl);
          } else {
            result = await advancedAI.falAI.generate3DModel(prompt, {
              style: falStyle,
              quality: falQuality as 'low' | 'medium' | 'high'
            });
          }
          break;
          
        case 'stability':
          result = await advancedAI.stabilityAI.generateImage(prompt, {
            width: parseInt(imageSize),
            height: parseInt(imageSize),
            style: stabilityStyle
          });
          break;
          
        case 'replicate':
          result = await advancedAI.replicate.generate3DFromText(prompt);
          break;
          
        case 'deepmind':
          // For demo purposes, creating a mock structural analysis
          result = {
            description: `Structural analysis of: ${prompt}`,
            analysis: {
              stability_score: 0.85,
              weak_points: ["Joint connections", "Load distribution"],
              recommendations: ["Reinforce corner joints", "Add support beams"]
            }
          };
          break;
          
        default:
          throw new Error("Unknown provider");
      }

      // Convert result to CAD format
      const cadData = {
        id: crypto.randomUUID(),
        description: result.description || prompt,
        coordinates: [],
        shapes: result.shapes || [
          {
            type: 'cube',
            position: {x: 0, y: 0.5, z: 0},
            scale: {x: 1, y: 1, z: 1},
            rotation: {x: 0, y: 0, z: 0}
          }
        ],
        metadata: {
          prompt,
          provider: selectedProvider,
          timestamp: new Date().toISOString(),
          ...result
        }
      };

      onGenerate(cadData);
      toast.success(`3D model generated with ${providers.find(p => p.id === selectedProvider)?.name}!`);
      setPrompt("");
      setImageUrl("");
    } catch (error) {
      console.error('Advanced AI generation error:', error);
      toast.error("Failed to generate with AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const themeClasses = theme === 'light'
    ? 'bg-white border-stone-200 text-black'
    : 'bg-gray-800 border-gray-700 text-white';

  return (
    <Card className={`w-96 ${themeClasses} shadow-xl`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Advanced AI Studio</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label>AI Provider</Label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => {
                const IconComponent = provider.icon;
                return (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${provider.color}`} />
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-gray-500">{provider.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-3">
            <div>
              <Label htmlFor="prompt">Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-3">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Provider-specific options */}
        {selectedProvider === 'fal' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Style</Label>
              <Select value={falStyle} onValueChange={setFalStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="stylized">Stylized</SelectItem>
                  <SelectItem value="architectural">Architectural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quality</Label>
              <Select value={falQuality} onValueChange={setFalQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedProvider === 'stability' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Style</Label>
              <Select value={stabilityStyle} onValueChange={setStabilityStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architectural">Architectural</SelectItem>
                  <SelectItem value="photographic">Photographic</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512x512</SelectItem>
                  <SelectItem value="1024">1024x1024</SelectItem>
                  <SelectItem value="2048">2048x2048</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            AI Powered
          </Badge>
          <Badge variant="outline" className="text-xs">
            Multi-Provider
          </Badge>
          <Badge variant="outline" className="text-xs">
            Professional
          </Badge>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt.trim() && !imageUrl.trim())}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" />
              Generate with {providers.find(p => p.id === selectedProvider)?.name}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
