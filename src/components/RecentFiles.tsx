
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, MoreHorizontal, Edit, Trash } from "lucide-react";
import { mockRecentFiles } from "@/lib/database";
import { useState } from "react";
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
  image: "🖼️"
};

const fileTypeColors = {
  dwg: "text-cyan-400",
  pdf: "text-red-400",
  '3d': "text-purple-400",
  image: "text-green-400"
};

export const RecentFiles = () => {
  const [files, setFiles] = useState(mockRecentFiles);
  const [deleteFile, setDeleteFile] = useState<any>(null);
  const { toast } = useToast();

  const handleViewFile = (file: any) => {
    toast({
      title: "Opening File",
      description: `Opening ${file.name}...`,
    });
    // In a real app, this would open the file viewer
    console.log("Opening file:", file);
  };

  const handleDownloadFile = (file: any, event: React.MouseEvent) => {
    event.stopPropagation();
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    });
    // In a real app, this would trigger the download
    console.log("Downloading file:", file);
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
      const index = mockRecentFiles.findIndex(f => f.id === deleteFile.id);
      if (index !== -1) {
        mockRecentFiles.splice(index, 1);
        setFiles([...mockRecentFiles]);
        toast({
          title: "File Deleted",
          description: `${deleteFile.name} has been deleted.`,
        });
      }
      setDeleteFile(null);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Recent Files
        </CardTitle>
      </CardHeader>
      <CardContent>
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
