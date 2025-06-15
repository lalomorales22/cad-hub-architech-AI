
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CodeChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [projectData, setProjectData] = useState({
    location: "",
    buildingType: "",
    occupancy: "",
    area: "",
    height: ""
  });
  const [uploadedPlans, setUploadedPlans] = useState<File[]>([]);
  const [complianceResults, setComplianceResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedPlans(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const handleCheck = async () => {
    if (!projectData.location || !projectData.buildingType) {
      toast.error("Please provide location and building type");
      return;
    }

    setIsChecking(true);
    try {
      // Simulate code compliance check
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockResults = {
        overallCompliance: 85,
        issues: [
          {
            category: "Zoning",
            severity: "high",
            description: "Building height exceeds 35ft limit for R-1 zone",
            solution: "Reduce building height or request variance"
          },
          {
            category: "Parking",
            severity: "medium", 
            description: "Parking spaces: 8 provided, 10 required",
            solution: "Add 2 additional parking spaces"
          },
          {
            category: "Accessibility",
            severity: "low",
            description: "Ramp slope slightly exceeds ADA maximum",
            solution: "Adjust ramp slope to 1:12 maximum"
          }
        ],
        passedChecks: [
          "Setback requirements met (front: 25ft, sides: 8ft)",
          "Fire egress paths properly designed",
          "Structural load paths compliant",
          "Window area ratios within limits",
          "Ceiling heights meet minimum requirements"
        ],
        codeReferences: [
          "IBC 2021 - Chapter 5: General Building Heights",
          "Local Zoning Code - Section 15.04: R-1 District",
          "ADA Guidelines - Section 4.8: Ramps"
        ]
      };

      setComplianceResults(mockResults);
      toast.success("Code compliance check completed!");
    } catch (error) {
      toast.error("Code check failed. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Smart Code Compliance Checker</h2>
        <p className="text-gray-400">AI-powered building code and zoning compliance verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Project Information
            </CardTitle>
            <CardDescription>Enter project details for code compliance check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Project Location*</Label>
              <Input
                id="location"
                value={projectData.location}
                onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State (e.g., San Diego, CA)"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingType" className="text-white">Building Type*</Label>
              <select
                id="buildingType"
                value={projectData.buildingType}
                onChange={(e) => setProjectData(prev => ({ ...prev, buildingType: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select building type</option>
                <option value="single-family">Single Family Residence</option>
                <option value="multi-family">Multi-Family Residence</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
                <option value="mixed-use">Mixed Use</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupancy" className="text-white">Occupancy Classification</Label>
              <select
                id="occupancy"
                value={projectData.occupancy}
                onChange={(e) => setProjectData(prev => ({ ...prev, occupancy: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select occupancy</option>
                <option value="R-1">R-1 - Hotels, Motels</option>
                <option value="R-2">R-2 - Apartments, Condos</option>
                <option value="R-3">R-3 - Single Family Homes</option>
                <option value="B">B - Business</option>
                <option value="M">M - Mercantile</option>
                <option value="A">A - Assembly</option>
                <option value="I">I - Institutional</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area" className="text-white">Building Area (sq ft)</Label>
                <Input
                  id="area"
                  value={projectData.area}
                  onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="3200"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-white">Building Height (ft)</Label>
                <Input
                  id="height"
                  value={projectData.height}
                  onChange={(e) => setProjectData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="28"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planUpload" className="text-white">Upload Plans (Optional)</Label>
              <Input
                id="planUpload"
                type="file"
                multiple
                accept=".pdf,.dwg,.jpg,.png"
                onChange={handleFileUpload}
                className="bg-gray-700 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
              {uploadedPlans.length > 0 && (
                <p className="text-green-400 text-sm">✓ {uploadedPlans.length} file(s) uploaded</p>
              )}
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={isChecking}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Compliance...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Check Code Compliance
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Compliance Report</CardTitle>
            <CardDescription>Code compliance analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            {complianceResults ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {complianceResults.overallCompliance}%
                  </div>
                  <p className="text-gray-400">Overall Compliance Score</p>
                </div>

                {complianceResults.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Issues Found ({complianceResults.issues.length})
                    </h4>
                    <div className="space-y-3">
                      {complianceResults.issues.map((issue: any, index: number) => (
                        <Alert key={index} className="bg-gray-700 border-gray-600">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-white">{issue.category}</span>
                              <Badge variant={getSeverityColor(issue.severity) as any}>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
                            <p className="text-blue-400 text-sm">💡 {issue.solution}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Passed Checks ({complianceResults.passedChecks.length})
                  </h4>
                  <div className="space-y-1">
                    {complianceResults.passedChecks.map((check: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Code References</h4>
                  <div className="space-y-1">
                    {complianceResults.codeReferences.map((ref: string, index: number) => (
                      <p key={index} className="text-gray-400 text-sm">• {ref}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter project details and check compliance</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
