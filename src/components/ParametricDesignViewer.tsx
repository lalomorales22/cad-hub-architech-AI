
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Share, Edit } from "lucide-react";

interface ParametricDesignViewerProps {
  design: any;
  onClose: () => void;
}

export const ParametricDesignViewer = ({ design, onClose }: ParametricDesignViewerProps) => {
  if (!design) return null;

  const generateDesignImage = () => {
    // Generate a visual representation based on parameters
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 400, 300);
      
      // Draw building outline based on parameters
      const height = design.parameters.height;
      const area = design.parameters.area;
      const buildingWidth = Math.sqrt(area) / 10;
      const buildingHeight = height * 5;
      
      ctx.fillStyle = '#333';
      ctx.fillRect(150, 200 - buildingHeight, buildingWidth, buildingHeight);
      
      // Draw windows
      ctx.fillStyle = '#87CEEB';
      const windowRatio = design.parameters.windows / 100;
      const numWindows = Math.floor(windowRatio * 6);
      
      for (let i = 0; i < numWindows; i++) {
        const x = 160 + (i % 3) * 20;
        const y = 180 - Math.floor(i / 3) * 30;
        ctx.fillRect(x, y, 15, 20);
      }
      
      // Draw roof
      ctx.fillStyle = '#8B4513';
      const roofHeight = design.parameters.pitch * 3;
      ctx.beginPath();
      ctx.moveTo(145, 200 - buildingHeight);
      ctx.lineTo(150 + buildingWidth/2, 200 - buildingHeight - roofHeight);
      ctx.lineTo(155 + buildingWidth, 200 - buildingHeight);
      ctx.closePath();
      ctx.fill();
    }
    
    return canvas.toDataURL();
  };

  const designImage = generateDesignImage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">{design.name} - Detailed View</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Design Visualization */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Design Preview</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <img 
                  src={designImage} 
                  alt="Generated Design" 
                  className="w-full rounded border border-gray-600"
                />
              </div>
              
              <div className="text-center text-4xl mb-2">{design.preview}</div>
              
              <div className="flex gap-2 justify-center">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-1 h-3 w-3" />
                  Export Image
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Share className="mr-1 h-3 w-3" />
                  Share Design
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit Parameters
                </Button>
              </div>
            </div>

            {/* Design Details */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Design Specifications</h3>
              
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Height:</span>
                    <span className="text-white ml-2">{design.parameters.height} ft</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Floor Area:</span>
                    <span className="text-white ml-2">{design.parameters.area} sq ft</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Window Ratio:</span>
                    <span className="text-white ml-2">{design.parameters.windows}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Roof Pitch:</span>
                    <span className="text-white ml-2">{design.parameters.pitch}/12</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Design Score:</span>
                    <Badge className="bg-green-600">{design.score}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Efficiency:</span>
                    <Badge className={design.efficiency === 'Very High' ? 'bg-green-600' : 
                                    design.efficiency === 'High' ? 'bg-blue-600' : 'bg-yellow-600'}>
                      {design.efficiency}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estimated Cost:</span>
                    <span className="text-green-400 font-semibold">${design.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">AI Recommendations</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Optimize window placement for natural lighting</p>
                  <p>• Consider adding solar panels for sustainability</p>
                  <p>• Roof pitch is optimal for local climate conditions</p>
                  <p>• Building orientation maximizes energy efficiency</p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Generated Blueprint Text</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>Project:</strong> {design.name}</p>
                  <p><strong>Total Area:</strong> {design.parameters.area} sq ft</p>
                  <p><strong>Building Height:</strong> {design.parameters.height} ft</p>
                  <p><strong>Foundation:</strong> Concrete slab on grade</p>
                  <p><strong>Framing:</strong> Wood frame construction</p>
                  <p><strong>Roofing:</strong> Asphalt shingles, {design.parameters.pitch}/12 pitch</p>
                  <p><strong>Windows:</strong> Double-hung, energy efficient</p>
                  <p><strong>Insulation:</strong> R-15 walls, R-30 ceiling</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
