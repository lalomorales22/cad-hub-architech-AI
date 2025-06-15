
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WandSparkles, Loader2, X } from "lucide-react";
import { aiService } from "@/services/aiServices";
import { toast } from "sonner";

interface AIGenerationWidgetProps {
  onGenerate: (cadData: any) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const AIGenerationWidget = ({ onGenerate, onClose, theme }: AIGenerationWidgetProps) => {
  const [prompt, setPrompt] = useState("");
  const [generationType, setGenerationType] = useState("architecture");
  const [complexity, setComplexity] = useState("medium");
  const [style, setStyle] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);

  const generationTypes = [
    { value: "architecture", label: "Architecture", desc: "Buildings, houses, structures" },
    { value: "furniture", label: "Furniture", desc: "Chairs, tables, storage" },
    { value: "landscape", label: "Landscape", desc: "Gardens, outdoor elements" },
    { value: "interior", label: "Interior", desc: "Room layouts, fixtures" },
    { value: "structural", label: "Structural", desc: "Beams, columns, supports" },
  ];

  const styles = [
    "Modern", "Classical", "Minimalist", "Industrial", "Contemporary", 
    "Art Deco", "Brutalist", "Gothic", "Mediterranean", "Scandinavian"
  ];

  const complexityLevels = [
    { value: "simple", label: "Simple", desc: "Basic shapes" },
    { value: "medium", label: "Medium", desc: "Moderate detail" },
    { value: "complex", label: "Complex", desc: "High detail" },
    { value: "professional", label: "Professional", desc: "Maximum detail" }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsGenerating(true);
    try {
      const enhancedPrompt = `${generationType}: ${prompt}. Style: ${style}. Make it detailed and architecturally accurate.`;
      
      const result = await aiService.generateCADFromText({
        prompt: enhancedPrompt,
        style,
        complexity
      });

      onGenerate(result);
      toast.success("3D model generated successfully!");
      setPrompt("");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate 3D model");
    } finally {
      setIsGenerating(false);
    }
  };

  const themeClasses = theme === 'light'
    ? 'bg-white border-gray-300 text-gray-900'
    : 'bg-gray-800 border-gray-700 text-white';

  return (
    <Card className={`w-80 ${themeClasses} shadow-xl`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">AI Generator</h3>
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
          <Label htmlFor="generation-type">Type</Label>
          <Select value={generationType} onValueChange={setGenerationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prompt">Description</Label>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to generate... (e.g., 'A modern two-story house with large windows')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {complexityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.desc}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            AI Powered
          </Badge>
          <Badge variant="outline" className="text-xs">
            Real-time
          </Badge>
          <Badge variant="outline" className="text-xs">
            3D Ready
          </Badge>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
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
              Generate 3D Model
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
