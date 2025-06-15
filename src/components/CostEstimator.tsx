import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Calculator, TrendingUp, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CostEstimator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [projectData, setProjectData] = useState({
    area: "",
    stories: "",
    buildingType: "",
    qualityLevel: "",
    location: "",
    foundationType: "",
    roofType: "",
    hvacType: "",
    electricalLoad: "",
    plumbingFixtures: ""
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [costResults, setCostResults] = useState<any>(null);

  const addOnOptions = [
    { id: "solar", name: "Solar Panel System", cost: 25000, description: "15kW solar installation" },
    { id: "pool", name: "Swimming Pool", cost: 35000, description: "In-ground pool with equipment" },
    { id: "elevator", name: "Residential Elevator", cost: 45000, description: "2-stop residential elevator" },
    { id: "fireplace", name: "Gas Fireplace", cost: 3500, description: "Ventless gas fireplace insert" },
    { id: "deck", name: "Composite Deck", cost: 8000, description: "400 sq ft composite decking" },
    { id: "garage", name: "Detached Garage", cost: 18000, description: "2-car detached garage" },
    { id: "landscaping", name: "Professional Landscaping", cost: 12000, description: "Complete yard design" },
    { id: "security", name: "Security System", cost: 4500, description: "Cameras, alarms, monitoring" },
    { id: "smart_home", name: "Smart Home Package", cost: 8500, description: "Automated lighting, climate, locks" },
    { id: "wine_cellar", name: "Wine Cellar", cost: 15000, description: "Climate-controlled wine storage" }
  ];

  const repairOptions = [
    { id: "roof_repair", name: "Roof Replacement", cost: 15000, description: "Complete roof replacement" },
    { id: "hvac_repair", name: "HVAC System Upgrade", cost: 8000, description: "New furnace and AC unit" },
    { id: "electrical_repair", name: "Electrical Panel Upgrade", cost: 3500, description: "200-amp electrical panel" },
    { id: "plumbing_repair", name: "Plumbing Renovation", cost: 12000, description: "Re-pipe entire house" },
    { id: "foundation_repair", name: "Foundation Repair", cost: 20000, description: "Foundation stabilization" },
    { id: "siding_repair", name: "Exterior Siding", cost: 18000, description: "Vinyl siding replacement" },
    { id: "window_repair", name: "Window Replacement", cost: 12000, description: "Energy-efficient windows" },
    { id: "flooring_repair", name: "Flooring Upgrade", cost: 8000, description: "Hardwood flooring installation" }
  ];

  const handleCalculate = async () => {
    if (!projectData.area || !projectData.buildingType) {
      toast.error("Please provide building area and type");
      return;
    }

    setIsCalculating(true);
    try {
      // Simulate cost calculation with AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const area = parseInt(projectData.area);
      const baseRate = getBaseRate(projectData.buildingType, projectData.qualityLevel);
      const locationMultiplier = getLocationMultiplier(projectData.location);
      
      const addOnCosts = selectedAddOns.reduce((total, addOnId) => {
        const addOn = [...addOnOptions, ...repairOptions].find(option => option.id === addOnId);
        return total + (addOn?.cost || 0);
      }, 0);

      const baseCost = Math.round(area * baseRate * locationMultiplier);
      const totalCost = baseCost + addOnCosts;
      
      const mockResults = {
        totalCost: totalCost,
        baseCost: baseCost,
        addOnCosts: addOnCosts,
        costPerSqFt: Math.round(baseRate * locationMultiplier),
        breakdown: {
          sitework: Math.round(baseCost * 0.08),
          foundation: Math.round(baseCost * 0.12),
          framing: Math.round(baseCost * 0.18),
          roofing: Math.round(baseCost * 0.08),
          exterior: Math.round(baseCost * 0.15),
          interior: Math.round(baseCost * 0.25),
          mechanical: Math.round(baseCost * 0.14)
        },
        materials: [
          { item: "Concrete", quantity: `${Math.round(area * 0.15)} CY`, unitCost: 150, total: Math.round(area * 0.15 * 150) },
          { item: "Steel Framing", quantity: `${Math.round(area * 8)} lbs`, unitCost: 0.75, total: Math.round(area * 8 * 0.75) },
          { item: "Roofing Material", quantity: `${Math.round(area / 100)} squares`, unitCost: 120, total: Math.round(area / 100 * 120) },
          { item: "Drywall", quantity: `${Math.round(area * 2.5)} SF`, unitCost: 1.80, total: Math.round(area * 2.5 * 1.80) },
          { item: "Flooring", quantity: `${Math.round(area * 0.8)} SF`, unitCost: 4.50, total: Math.round(area * 0.8 * 4.50) },
          { item: "Windows", quantity: `${Math.round(area / 100)} units`, unitCost: 450, total: Math.round(area / 100 * 450) },
          { item: "Insulation", quantity: `${Math.round(area * 1.2)} SF`, unitCost: 2.25, total: Math.round(area * 1.2 * 2.25) },
          { item: "Electrical Wire", quantity: `${Math.round(area / 10)} ft`, unitCost: 1.50, total: Math.round(area / 10 * 1.50) }
        ],
        timeline: getProjectTimeline(area, selectedAddOns.length),
        contingency: Math.round(totalCost * 0.1),
        aiRecommendations: generateAIRecommendations(projectData, selectedAddOns)
      };

      setCostResults(mockResults);
      toast.success("Cost estimate completed with AI analysis!");
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

  const getProjectTimeline = (area: number, addOnCount: number) => {
    const baseMonths = Math.round(area / 1000 * 4);
    const addOnMonths = addOnCount * 0.5;
    const totalMonths = baseMonths + addOnMonths;
    return `${Math.round(totalMonths)}-${Math.round(totalMonths + 2)} months`;
  };

  const generateAIRecommendations = (data: any, addOns: string[]) => {
    const recommendations = [];
    
    if (parseInt(data.area) > 3000) {
      recommendations.push("Consider zoned HVAC system for large area");
    }
    if (data.location.toLowerCase().includes('california')) {
      recommendations.push("Solar panels recommended for energy savings");
    }
    if (addOns.includes('pool')) {
      recommendations.push("Pool requires additional electrical and plumbing permits");
    }
    if (data.qualityLevel === 'luxury') {
      recommendations.push("Luxury finishes may extend timeline by 20%");
    }
    
    return recommendations;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddOns(prev => [...prev, addOnId]);
    } else {
      setSelectedAddOns(prev => prev.filter(id => id !== addOnId));
    }
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

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Additional Features</h4>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {addOnOptions.map((addOn) => (
                  <div key={addOn.id} className="flex items-start space-x-3 p-2 bg-gray-700 rounded">
                    <Checkbox 
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor={addOn.id} className="text-white text-sm font-medium cursor-pointer">
                        {addOn.name}
                      </label>
                      <p className="text-gray-400 text-xs">{addOn.description}</p>
                      <p className="text-green-400 text-xs font-medium">{formatCurrency(addOn.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Repairs & Upgrades</h4>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {repairOptions.map((repair) => (
                  <div key={repair.id} className="flex items-start space-x-3 p-2 bg-gray-700 rounded">
                    <Checkbox 
                      id={repair.id}
                      checked={selectedAddOns.includes(repair.id)}
                      onCheckedChange={(checked) => handleAddOnToggle(repair.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor={repair.id} className="text-white text-sm font-medium cursor-pointer">
                        {repair.name}
                      </label>
                      <p className="text-gray-400 text-xs">{repair.description}</p>
                      <p className="text-orange-400 text-xs font-medium">{formatCurrency(repair.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  {costResults.addOnCosts > 0 && (
                    <p className="text-sm text-blue-400 mt-2">
                      Includes {formatCurrency(costResults.addOnCosts)} in add-ons
                    </p>
                  )}
                </div>

                {costResults.aiRecommendations && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                    <h4 className="text-blue-400 font-semibold mb-2">AI Recommendations</h4>
                    <ul className="text-blue-300 text-sm space-y-1">
                      {costResults.aiRecommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

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
