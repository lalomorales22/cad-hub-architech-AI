
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, MoreHorizontal, Edit, Trash, Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
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
  dwg: "📐",
  pdf: "📄",
  '3d': "🎯",
  image: "🖼️",
  txt: "📝",
  md: "📄"
};

const fileTypeColors = {
  dwg: "text-cyan-400",
  pdf: "text-red-400",
  '3d': "text-purple-400",
  image: "text-green-400",
  txt: "text-blue-400",
  md: "text-yellow-400"
};

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'dwg':
      return 'dwg';
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    case 'txt':
      return 'txt';
    case 'md':
      return 'md';
    case 'obj':
    case 'stl':
    case '3ds':
      return '3d';
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

export const RecentFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [deleteFile, setDeleteFile] = useState<any>(null);
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
      size: formatFileSize(file.size),
      lastModified: 'Just now',
      projectId: '1',
      file: file // Store the actual file object for later use
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Added",
      description: `${uploadedFiles.length} file(s) added successfully.`,
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
      // Create a download link
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
    // In a real app, this would open the file editor
    console.log("Editing file:", file);
  };

  const handleDeleteConfirm = () => {
    if (deleteFile) {
      setFiles(prev => prev.filter(f => f.id !== deleteFile.id));
      toast({
        title: "File Deleted",
        description: `${deleteFile.name} has been deleted.`,
      });
      setDeleteFile(null);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            File Manager
          </CardTitle>
          <Button
            onClick={handleAddFiles}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Files
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No files uploaded yet</p>
            <p className="text-gray-500 text-sm mb-4">
              Upload PDF, DWG, JPG, PNG, TXT, or MD files to get started
            </p>
            <Button
              onClick={handleAddFiles}
              variant="outline"
              className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First File
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger asChild>
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => handleViewFile(file)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{fileTypeIcons[file.type]}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                          {file.size} • {file.lastModified}
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
            ))}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.dwg,.jpg,.jpeg,.png,.txt,.md"
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
              Are you sure you want to delete "{deleteFile?.name}"? This action cannot be undone.
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
