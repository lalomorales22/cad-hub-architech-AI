
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Upload, Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const StructuralAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState({
    buildingHeight: "",
    loadType: "residential",
    location: "",
    seismicZone: ""
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile && !analysisData.buildingHeight) {
      toast.error("Please upload a file or provide building height");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate structural analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        structuralIntegrity: "Good",
        riskLevel: "Low",
        recommendations: [
          "Steel beam size: W12x26 for main spans",
          "Column spacing: 20ft maximum for efficient load distribution",
          "Foundation: Spread footings with 3000 PSI concrete minimum",
          "Lateral system: Moment frames recommended for seismic resistance"
        ],
        loadAnalysis: {
          deadLoad: "15 PSF",
          liveLoad: "40 PSF",
          windLoad: "25 PSF",
          seismicLoad: "12 PSF"
        },
        complianceIssues: [
          "Beam deflection within L/360 limits",
          "Column buckling ratios acceptable",
          "Connection details meet code requirements"
        ]
      };

      setAnalysisResults(mockResults);
      toast.success("Structural analysis completed!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Structural Analysis</h2>
        <p className="text-gray-400">Get AI-powered structural engineering recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload & Configure
            </CardTitle>
            <CardDescription>Upload plans and set structural parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileUpload" className="text-white">Upload Floor Plans/3D Model</Label>
              <Input
                id="fileUpload"
                type="file"
                accept=".pdf,.dwg,.jpg,.png,.3dm"
                onChange={handleFileUpload}
                className="bg-gray-700 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
              {uploadedFile && (
                <p className="text-green-400 text-sm">✓ {uploadedFile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingHeight" className="text-white">Building Height (ft)</Label>
              <Input
                id="buildingHeight"
                value={analysisData.buildingHeight}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, buildingHeight: e.target.value }))}
                placeholder="25"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loadType" className="text-white">Load Type</Label>
              <select
                id="loadType"
                value={analysisData.loadType}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, loadType: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input
                id="location"
                value={analysisData.location}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seismicZone" className="text-white">Seismic Design Category</Label>
              <select
                id="seismicZone"
                value={analysisData.seismicZone}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, seismicZone: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select category</option>
                <option value="A">A - Very Low</option>
                <option value="B">B - Low</option>
                <option value="C">C - Moderate</option>
                <option value="D">D - High</option>
                <option value="E">E - Very High</option>
              </select>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Structure...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Analyze Structure
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Analysis Results</CardTitle>
            <CardDescription>Structural engineering recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Structural Integrity</span>
                  <Badge variant={analysisResults.structuralIntegrity === "Good" ? "default" : "destructive"}>
                    {analysisResults.structuralIntegrity}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Risk Level</span>
                  <Badge variant={analysisResults.riskLevel === "Low" ? "default" : "destructive"}>
                    {analysisResults.riskLevel}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Load Analysis</h4>
                  <div className="bg-gray-700 p-3 rounded text-sm">
                    {Object.entries(analysisResults.loadAnalysis).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-gray-300">
                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResults.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Compliance Status</h4>
                  <div className="space-y-2">
                    {analysisResults.complianceIssues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload files and run analysis to see results</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
