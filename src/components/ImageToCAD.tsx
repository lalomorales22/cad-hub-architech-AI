
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Zap, 
  X,
  Settings,
  Save,
  Download,
  Grid,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { ThreeJSCanvas } from "./ThreeJSCanvas";

export const ImageToCAD = () => {
  const [uploadedImages, setUploadedImages] = useState<Array<{id: number, name: string, url: string, status: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          url,
          status: 'uploaded'
        };
        setUploadedImages(prev => [newImage, ...prev]);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const processImage = (imageId: number) => {
    setIsProcessing(true);
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, status: 'processing' } : img
      )
    );

    // Simulate AI processing
    setTimeout(() => {
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, status: 'completed' } : img
        )
      );
      setIsProcessing(false);
    }, 4000);
  };

  const removeImage = (imageId: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const viewTools = [
    { name: "Zoom In", icon: ZoomIn },
    { name: "Zoom Out", icon: ZoomOut },
    { name: "Reset View", icon: RotateCcw },
    { name: "Grid", icon: Grid },
    { name: "Layers", icon: Layers },
  ];

  return (
    <div className="h-full flex bg-gray-900">
      {/* Left Panel - Image Upload & History */}
      <div className="w-80 border-r border-gray-700 bg-gray-800/30 flex flex-col">
        {/* Upload Area */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">Upload Images</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-400/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-2">
              Drag & drop images here
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <Upload className="h-3 w-3 mr-1" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: JPG, PNG, WebP • Max 10MB per file
          </p>
        </div>

        {/* View Controls */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">View Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            {viewTools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                size="sm"
                className="h-8 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <tool.icon className="h-3 w-3 mr-1" />
                <span className="text-xs">{tool.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Uploaded Images */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">Recent Uploads</h3>
          <div className="space-y-3">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="bg-gray-700/50 border-gray-600">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-12 h-12 rounded object-cover bg-gray-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            image.status === 'completed' ? 'bg-green-600/20 text-green-400' : 
                            image.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-blue-600/20 text-blue-400'
                          }`}
                        >
                          {image.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-300 truncate mb-2">{image.name}</p>
                      {image.status === 'uploaded' && (
                        <Button
                          size="sm"
                          onClick={() => processImage(image.id)}
                          disabled={isProcessing}
                          className="h-6 bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {uploadedImages.length === 0 && (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="h-14 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-semibold">Image-to-CAD Workspace</h2>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
              Vision AI
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-gray-900">
          <ThreeJSCanvas />
          
          {/* Canvas Overlay Info */}
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <div className="text-white text-sm font-medium">Active Project</div>
            <div className="text-gray-400 text-xs">Image-to-CAD Generation</div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                <div>
                  <div className="text-white font-medium">Processing Image</div>
                  <div className="text-gray-400 text-sm">Converting to 3D model...</div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Info */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
            <div className="text-gray-400 text-xs">Grid: 1m | Units: Metric</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="h-20 bg-gray-800/50 border-t border-gray-700 p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-1">
                Upload reference images, sketches, or photos to generate 3D CAD models
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: Floor plans, elevation drawings, site photos, architectural sketches
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
