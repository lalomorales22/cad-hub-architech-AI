
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, MoreHorizontal, Edit, Trash, Plus, Upload, FolderOpen, Search } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const fileTypeIcons = {
  pdf: "📄",
  dwg: "📐",
  dxf: "📐",
  '3d': "🎯",
  image: "🖼️",
  txt: "📝",
  md: "📄",
  doc: "📄",
  docx: "📄",
  xlsx: "📊",
  xls: "📊",
  csv: "📊",
  zip: "📦",
  rar: "📦",
  cad: "🏗️",
  skp: "🏢",
  ifc: "🏗️",
  step: "⚙️",
  iges: "⚙️",
  stl: "🎯",
  obj: "🎯",
  fbx: "🎯",
  gltf: "🎯",
  glb: "🎯",
  video: "🎬",
  audio: "🎵"
};

const fileTypeColors = {
  pdf: "text-red-400",
  dwg: "text-cyan-400",
  dxf: "text-cyan-400",
  '3d': "text-purple-400",
  image: "text-green-400",
  txt: "text-blue-400",
  md: "text-yellow-400",
  doc: "text-blue-600",
  docx: "text-blue-600",
  xlsx: "text-green-600",
  xls: "text-green-600",
  csv: "text-green-500",
  zip: "text-orange-400",
  rar: "text-orange-400",
  cad: "text-cyan-500",
  skp: "text-purple-500",
  ifc: "text-cyan-600",
  step: "text-gray-400",
  iges: "text-gray-400",
  stl: "text-purple-600",
  obj: "text-purple-600",
  fbx: "text-purple-600",
  gltf: "text-purple-600",
  glb: "text-purple-600",
  video: "text-pink-400",
  audio: "text-indigo-400"
};

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'dwg':
      return 'dwg';
    case 'dxf':
      return 'dxf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return 'image';
    case 'txt':
      return 'txt';
    case 'md':
      return 'md';
    case 'doc':
      return 'doc';
    case 'docx':
      return 'docx';
    case 'xlsx':
      return 'xlsx';
    case 'xls':
      return 'xls';
    case 'csv':
      return 'csv';
    case 'zip':
      return 'zip';
    case 'rar':
      return 'rar';
    case 'skp':
      return 'skp';
    case 'ifc':
      return 'ifc';
    case 'step':
    case 'stp':
      return 'step';
    case 'iges':
    case 'igs':
      return 'iges';
    case 'stl':
      return 'stl';
    case 'obj':
      return 'obj';
    case 'fbx':
      return 'fbx';
    case 'gltf':
      return 'gltf';
    case 'glb':
      return 'glb';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return 'video';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return 'audio';
    default:
      return 'txt';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileCategory = (fileType: string) => {
  const categories = {
    'CAD Files': ['dwg', 'dxf', 'skp', 'ifc', 'step', 'iges'],
    '3D Models': ['stl', 'obj', 'fbx', 'gltf', 'glb', '3d'],
    'Documents': ['pdf', 'doc', 'docx', 'txt', 'md'],
    'Spreadsheets': ['xlsx', 'xls', 'csv'],
    'Images': ['image'],
    'Archives': ['zip', 'rar'],
    'Media': ['video', 'audio']
  };

  for (const [category, types] of Object.entries(categories)) {
    if (types.includes(fileType)) return category;
  }
  return 'Other';
};

export const RecentFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [deleteFile, setDeleteFile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    const newFiles = uploadedFiles.map((file) => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      type: getFileType(file.name),
      category: getFileCategory(getFileType(file.name)),
      size: formatFileSize(file.size),
      rawSize: file.size,
      lastModified: 'Just now',
      uploadDate: new Date().toISOString(),
      projectId: '1',
      file: file,
      tags: []
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Added",
      description: `${uploadedFiles.length} file(s) added to your knowledge base.`,
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewFile = (file: any) => {
    if (file.file) {
      // Create a URL for the file and open it
      const fileURL = URL.createObjectURL(file.file);
      window.open(fileURL, '_blank');
      
      toast({
        title: "Opening File",
        description: `Opening ${file.name}...`,
      });
    } else {
      toast({
        title: "File Not Available",
        description: "This file is not available for viewing.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadFile = (file: any, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${file.name}...`,
      });
    } else {
      toast({
        title: "Download Failed",
        description: "This file is not available for download.",
        variant: "destructive"
      });
    }
  };

  const handleEditFile = (file: any) => {
    toast({
      title: "Edit File",
      description: `Opening ${file.name} for editing...`,
    });
    console.log("Editing file:", file);
  };

  const handleDeleteConfirm = () => {
    if (deleteFile) {
      setFiles(prev => prev.filter(f => f.id !== deleteFile.id));
      toast({
        title: "File Deleted",
        description: `${deleteFile.name} has been removed from your knowledge base.`,
      });
      setDeleteFile(null);
    }
  };

  // Filter files based on search and category
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(files.map(f => f.category)))];

  // Get total storage used
  const totalStorage = files.reduce((acc, file) => acc + (file.rawSize || 0), 0);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Knowledge Base
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">
              {files.length} files • {formatFileSize(totalStorage)}
            </div>
            <Button
              onClick={handleAddFiles}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-gray-400 text-sm">Search files</Label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-400 text-sm">Category</Label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-gray-700/50 border border-gray-600 text-white text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Build your knowledge base</p>
            <p className="text-gray-500 text-sm mb-4">
              Upload CAD files, documents, images, 3D models, and more to organize your architectural resources
            </p>
            <div className="text-xs text-gray-500 mb-4">
              Supported: PDF, DWG, DXF, SKP, IFC, STEP, STL, OBJ, FBX, GLB, Images, Documents, Archives
            </div>
            <Button
              onClick={handleAddFiles}
              variant="outline"
              className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Files
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No files match your search criteria</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <ContextMenu key={file.id}>
                  <ContextMenuTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => handleViewFile(file)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{fileTypeIcons[file.type] || "📄"}</div>
                        <div>
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {file.category} • {file.size} • {file.lastModified}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={(e) => handleDownloadFile(file, e)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  
                  <ContextMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <ContextMenuItem
                      onClick={() => handleViewFile(file)}
                      className="hover:bg-gray-700 cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View File
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleDownloadFile(file, {} as React.MouseEvent)}
                      className="hover:bg-gray-700 cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleEditFile(file)}
                      className="hover:bg-gray-700 cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit File
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => setDeleteFile(file)}
                      className="hover:bg-red-600 cursor-pointer text-red-400"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete File
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            )}
          </div>
        )}

        {/* Hidden file input with comprehensive file type support */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.dwg,.dxf,.skp,.ifc,.step,.stp,.iges,.igs,.stl,.obj,.fbx,.gltf,.glb,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.txt,.md,.doc,.docx,.xlsx,.xls,.csv,.zip,.rar,.mp4,.avi,.mov,.wmv,.flv,.mp3,.wav,.flac,.aac"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete "{deleteFile?.name}"? This will remove it from your knowledge base permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
