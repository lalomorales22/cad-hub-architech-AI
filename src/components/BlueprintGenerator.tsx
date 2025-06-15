
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";
import { aiService } from "@/services/aiServices";
import { toast } from "sonner";

export const BlueprintGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    lotWidth: "",
    lotDepth: "",
    buildingType: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    style: "",
    requirements: "",
    location: ""
  });
  const [generatedBlueprint, setGeneratedBlueprint] = useState<any>(null);

  const handleGenerate = async () => {
    if (!formData.lotWidth || !formData.lotDepth || !formData.buildingType) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate architectural blueprints for a ${formData.buildingType} on a ${formData.lotWidth}x${formData.lotDepth} ft lot. 
      ${formData.floors && `Floors: ${formData.floors}.`}
      ${formData.bedrooms && `Bedrooms: ${formData.bedrooms}.`}
      ${formData.bathrooms && `Bathrooms: ${formData.bathrooms}.`}
      ${formData.style && `Architectural style: ${formData.style}.`}
      ${formData.location && `Location: ${formData.location}.`}
      ${formData.requirements && `Special requirements: ${formData.requirements}.`}
      
      Create detailed floor plans with proper room layouts, dimensions, circulation paths, and architectural elements.`;

      const result = await aiService.generateCADFromText({
        prompt,
        style: formData.style || "modern",
        complexity: "high"
      });

      setGeneratedBlueprint(result);
      toast.success("Blueprint generated successfully!");
    } catch (error) {
      console.error("Blueprint generation error:", error);
      toast.error("Failed to generate blueprint");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Blueprint Generator</h2>
        <p className="text-gray-400">Generate complete architectural floor plans with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Requirements
            </CardTitle>
            <CardDescription>Define your building requirements and constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lotWidth" className="text-white">Lot Width (ft)*</Label>
                <Input
                  id="lotWidth"
                  value={formData.lotWidth}
                  onChange={(e) => setFormData(prev => ({ ...prev, lotWidth: e.target.value }))}
                  placeholder="100"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lotDepth" className="text-white">Lot Depth (ft)*</Label>
                <Input
                  id="lotDepth"
                  value={formData.lotDepth}
                  onChange={(e) => setFormData(prev => ({ ...prev, lotDepth: e.target.value }))}
                  placeholder="120"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingType" className="text-white">Building Type*</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, buildingType: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family Home</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="apartment">Apartment Building</SelectItem>
                  <SelectItem value="office">Office Building</SelectItem>
                  <SelectItem value="commercial">Commercial Space</SelectItem>
                  <SelectItem value="mixed-use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floors" className="text-white">Floors</Label>
                <Input
                  id="floors"
                  value={formData.floors}
                  onChange={(e) => setFormData(prev => ({ ...prev, floors: e.target.value }))}
                  placeholder="2"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-white">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="3"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-white">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="2"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style" className="text-white">Architectural Style</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="contemporary">Contemporary</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="craftsman">Craftsman</SelectItem>
                  <SelectItem value="colonial">Colonial</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-white">Special Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Open floor plan, home office, 3-car garage, etc."
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Blueprint
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Generated Blueprint</CardTitle>
            <CardDescription>AI-generated architectural floor plan</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedBlueprint ? (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Blueprint Details</h3>
                  <p className="text-gray-300 text-sm mb-4">{generatedBlueprint.description}</p>
                  <div className="text-gray-400 text-xs">
                    <p>Generated: {new Date(generatedBlueprint.metadata.timestamp).toLocaleString()}</p>
                    <p>Components: {generatedBlueprint.shapes.length} elements</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export DWG
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a blueprint to see results here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
