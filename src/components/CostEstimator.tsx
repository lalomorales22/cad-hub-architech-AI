
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calculator, TrendingUp, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CostEstimator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [projectData, setProjectData] = useState({
    area: "",
    stories: "",
    buildingType: "",
    qualityLevel: "",
    location: ""
  });
  const [costResults, setCostResults] = useState<any>(null);

  const handleCalculate = async () => {
    if (!projectData.area || !projectData.buildingType) {
      toast.error("Please provide building area and type");
      return;
    }

    setIsCalculating(true);
    try {
      // Simulate cost calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const area = parseInt(projectData.area);
      const baseRate = getBaseRate(projectData.buildingType, projectData.qualityLevel);
      const locationMultiplier = getLocationMultiplier(projectData.location);
      
      const mockResults = {
        totalCost: Math.round(area * baseRate * locationMultiplier),
        costPerSqFt: Math.round(baseRate * locationMultiplier),
        breakdown: {
          sitework: Math.round(area * baseRate * 0.08 * locationMultiplier),
          foundation: Math.round(area * baseRate * 0.12 * locationMultiplier),
          framing: Math.round(area * baseRate * 0.18 * locationMultiplier),
          roofing: Math.round(area * baseRate * 0.08 * locationMultiplier),
          exterior: Math.round(area * baseRate * 0.15 * locationMultiplier),
          interior: Math.round(area * baseRate * 0.25 * locationMultiplier),
          mechanical: Math.round(area * baseRate * 0.14 * locationMultiplier)
        },
        materials: [
          { item: "Concrete", quantity: "120 CY", unitCost: 150, total: 18000 },
          { item: "Steel Framing", quantity: "8,500 lbs", unitCost: 0.75, total: 6375 },
          { item: "Roofing Shingles", quantity: "35 squares", unitCost: 120, total: 4200 },
          { item: "Drywall", quantity: "6,400 SF", unitCost: 1.80, total: 11520 },
          { item: "Flooring", quantity: "3,200 SF", unitCost: 4.50, total: 14400 }
        ],
        timeline: "12-16 months",
        contingency: Math.round(area * baseRate * locationMultiplier * 0.1)
      };

      setCostResults(mockResults);
      toast.success("Cost estimate completed!");
    } catch (error) {
      toast.error("Cost calculation failed. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getBaseRate = (buildingType: string, quality: string) => {
    const baseRates: { [key: string]: number } = {
      "residential": 180,
      "commercial": 220,
      "office": 200,
      "retail": 160,
      "industrial": 120
    };
    
    const qualityMultiplier: { [key: string]: number } = {
      "basic": 0.8,
      "standard": 1.0,
      "premium": 1.3,
      "luxury": 1.6
    };
    
    return (baseRates[buildingType] || 180) * (qualityMultiplier[quality] || 1.0);
  };

  const getLocationMultiplier = (location: string) => {
    const locationMultipliers: { [key: string]: number } = {
      "san francisco": 1.4,
      "new york": 1.3,
      "los angeles": 1.2,
      "seattle": 1.15,
      "chicago": 1.1,
      "atlanta": 1.0,
      "dallas": 0.95,
      "phoenix": 0.9
    };
    
    const city = location.toLowerCase().split(',')[0];
    return locationMultipliers[city] || 1.0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Material & Cost Estimator</h2>
        <p className="text-gray-400">Generate detailed cost estimates and material takeoffs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Parameters
            </CardTitle>
            <CardDescription>Enter project details for cost estimation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area" className="text-white">Building Area (sq ft)*</Label>
              <Input
                id="area"
                value={projectData.area}
                onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="3200"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stories" className="text-white">Number of Stories</Label>
              <Input
                id="stories"
                value={projectData.stories}
                onChange={(e) => setProjectData(prev => ({ ...prev, stories: e.target.value }))}
                placeholder="2"
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
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualityLevel" className="text-white">Quality Level</Label>
              <select
                id="qualityLevel"
                value={projectData.qualityLevel}
                onChange={(e) => setProjectData(prev => ({ ...prev, qualityLevel: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select quality</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input
                id="location"
                value={projectData.location}
                onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={isCalculating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating Costs...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Calculate Cost Estimate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cost Estimate</CardTitle>
            <CardDescription>Detailed cost breakdown and materials</CardDescription>
          </CardHeader>
          <CardContent>
            {costResults ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {formatCurrency(costResults.totalCost)}
                  </div>
                  <p className="text-gray-300">Total Project Cost</p>
                  <p className="text-sm text-gray-400">
                    {formatCurrency(costResults.costPerSqFt)}/sq ft
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Cost Breakdown</h4>
                  {Object.entries(costResults.breakdown).map(([category, amount]) => {
                    const percentage = (amount as number / costResults.totalCost) * 100;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 capitalize">{category}</span>
                          <span className="text-white">{formatCurrency(amount as number)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Major Materials</h4>
                  <div className="space-y-2">
                    {costResults.materials.map((material: any, index: number) => (
                      <div key={index} className="bg-gray-700 p-3 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{material.item}</p>
                            <p className="text-gray-400">{material.quantity} @ {formatCurrency(material.unitCost)}</p>
                          </div>
                          <p className="text-green-400 font-medium">{formatCurrency(material.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  <div className="flex-1 bg-gray-700 p-3 rounded text-center">
                    <p className="text-gray-400">Timeline</p>
                    <p className="text-white font-medium">{costResults.timeline}</p>
                  </div>
                  <div className="flex-1 bg-gray-700 p-3 rounded text-center">
                    <p className="text-gray-400">Contingency</p>
                    <p className="text-white font-medium">{formatCurrency(costResults.contingency)}</p>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Export Estimate Report
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter project details to generate cost estimate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
