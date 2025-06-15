
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { fileService } from "@/services/fileServices";
import { toast } from "sonner";

interface ModelImporterProps {
  onImport: (data: any) => void;
  onClose: () => void;
}

export const ModelImporter = ({ onImport, onClose }: ModelImporterProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedFiles, setImportedFiles] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsImporting(true);
    const results = [];

    for (const file of Array.from(files)) {
      try {
        const result = await fileService.importFile(file);
        results.push(result);
        
        if (result.success) {
          toast.success(`${file.name} imported successfully`);
        }
      } catch (error) {
        toast.error(`Failed to import ${file.name}`);
      }
    }

    setImportedFiles(prev => [...prev, ...results.filter(r => r.success)]);
    setIsImporting(false);
  };

  const handleImportToWorkspace = (fileData: any) => {
    onImport(fileData);
    toast.success("Model imported to 3D workspace");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import 3D Models & CAD Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-white">Upload Files</Label>
            <Input
              type="file"
              multiple
              accept=".glb,.gltf,.obj,.fbx,.dwg,.dxf,.step,.iges"
              onChange={handleFileUpload}
              className="bg-gray-700 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
            />
            <div className="text-sm text-gray-400">
              Supported formats: GLB, GLTF, OBJ, FBX, DWG, DXF, STEP, IGES
            </div>
          </div>

          {isImporting && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
              <span className="text-white">Importing files...</span>
            </div>
          )}

          {importedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Imported Files</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {importedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <div>
                        <div className="text-white font-medium">{file.filename}</div>
                        <div className="text-gray-400 text-sm">{file.type}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleImportToWorkspace(file.data)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Import to Workspace
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-white">
              Cancel
            </Button>
            {importedFiles.length > 0 && (
              <Button 
                onClick={() => {
                  importedFiles.forEach(file => handleImportToWorkspace(file.data));
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Import All to Workspace
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
