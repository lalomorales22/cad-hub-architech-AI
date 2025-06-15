
import { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Ruler, 
  Layers,
  Grid3X3,
  Save,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface SceneObject {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

interface DocumentationGeneratorProps {
  theme: 'dark' | 'light';
  sceneObjects: SceneObject[];
  onClose: () => void;
}

export const DocumentationGenerator = ({ theme, sceneObjects, onClose }: DocumentationGeneratorProps) => {
  const [activeView, setActiveView] = useState('floor-plan');
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [scale, setScale] = useState('1:100');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFloorPlan = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw objects from top view (Y = 0 plane)
    sceneObjects.forEach(obj => {
      drawObjectTopView(ctx, obj);
    });

    // Add dimensions if enabled
    if (showDimensions) {
      addDimensions(ctx);
    }

    toast.success('Floor plan generated!');
  };

  const generateElevation = (direction: 'north' | 'south' | 'east' | 'west') => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw objects from side view
    sceneObjects.forEach(obj => {
      drawObjectElevation(ctx, obj, direction);
    });

    toast.success(`${direction} elevation generated!`);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = theme === 'light' ? '#e5e5e5' : '#333333';
    ctx.lineWidth = 0.5;
    
    const gridSize = 20;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawObjectTopView = (ctx: CanvasRenderingContext2D, obj: SceneObject) => {
    const centerX = 400;
    const centerY = 300;
    const scaleF = 50;
    
    const x = centerX + (obj.position.x * scaleF);
    const z = centerY + (obj.position.z * scaleF);
    const width = obj.scale.x * scaleF;
    const depth = obj.scale.z * scaleF;

    // Set color based on object type
    ctx.fillStyle = getObjectColor(obj.type);
    ctx.strokeStyle = theme === 'light' ? '#333333' : '#cccccc';
    ctx.lineWidth = 2;

    // Draw rectangle for top view
    ctx.fillRect(x - width/2, z - depth/2, width, depth);
    ctx.strokeRect(x - width/2, z - depth/2, width, depth);

    // Add label
    ctx.fillStyle = theme === 'light' ? '#333333' : '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(obj.name, x, z - depth/2 - 5);
  };

  const drawObjectElevation = (ctx: CanvasRenderingContext2D, obj: SceneObject, direction: string) => {
    const centerX = 400;
    const centerY = 300;
    const scaleF = 50;
    
    let x, y, width, height;
    
    switch (direction) {
      case 'north':
      case 'south':
        x = centerX + (obj.position.x * scaleF);
        y = centerY - (obj.position.y * scaleF);
        width = obj.scale.x * scaleF;
        height = obj.scale.y * scaleF;
        break;
      case 'east':
      case 'west':
        x = centerX + (obj.position.z * scaleF);
        y = centerY - (obj.position.y * scaleF);
        width = obj.scale.z * scaleF;
        height = obj.scale.y * scaleF;
        break;
      default:
        return;
    }

    ctx.fillStyle = getObjectColor(obj.type);
    ctx.strokeStyle = theme === 'light' ? '#333333' : '#cccccc';
    ctx.lineWidth = 2;

    ctx.fillRect(x - width/2, y - height/2, width, height);
    ctx.strokeRect(x - width/2, y - height/2, width, height);
  };

  const addDimensions = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.font = '10px Arial';
    
    // Add sample dimension lines
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();
    
    // Dimension text
    ctx.fillText('2.5m', 200, 95);
  };

  const getObjectColor = (type: string) => {
    switch (type) {
      case 'wall': return '#8B4513';
      case 'door': return '#CD853F';
      case 'window': return '#87CEEB';
      case 'cube': return '#4169E1';
      case 'cylinder': return '#32CD32';
      case 'sphere': return '#FF6347';
      default: return '#808080';
    }
  };

  const exportToPDF = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `${activeView}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast.success('Drawing exported!');
  };

  const themeClasses = theme === 'light'
    ? 'bg-white border-gray-300 text-gray-900'
    : 'bg-gray-800 border-gray-700 text-white';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className={`w-[90vw] h-[90vh] ${themeClasses}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h3 className="font-semibold">2D Documentation Generator</h3>
              <Badge variant="secondary">Beta</Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[calc(100%-80px)]">
          <div className="flex h-full">
            {/* Left Panel - Controls */}
            <div className="w-80 border-r p-4 space-y-4">
              <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
                  <TabsTrigger value="elevations">Elevations</TabsTrigger>
                </TabsList>

                <TabsContent value="floor-plan" className="space-y-4">
                  <Button 
                    onClick={generateFloorPlan} 
                    className="w-full"
                  >
                    Generate Floor Plan
                  </Button>
                </TabsContent>

                <TabsContent value="elevations" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => generateElevation('north')} size="sm">
                      North
                    </Button>
                    <Button onClick={() => generateElevation('south')} size="sm">
                      South
                    </Button>
                    <Button onClick={() => generateElevation('east')} size="sm">
                      East
                    </Button>
                    <Button onClick={() => generateElevation('west')} size="sm">
                      West
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Drawing Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Drawing Options</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Dimensions</span>
                  <Button
                    variant={showDimensions ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDimensions(!showDimensions)}
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Grid</span>
                  <Button
                    variant={showGrid ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <span className="text-sm">Scale</span>
                  <select 
                    value={scale} 
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="1:50">1:50</option>
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                  </select>
                </div>
              </div>

              {/* Object List */}
              <div className="space-y-2">
                <h4 className="font-medium">Scene Objects ({sceneObjects.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {sceneObjects.map(obj => (
                    <div key={obj.id} className="flex items-center justify-between p-2 border rounded text-sm">
                      <span>{obj.name}</span>
                      <Badge variant="outline" className="text-xs">{obj.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 p-4">
              <div className="w-full h-full border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full bg-white dark:bg-gray-900"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
