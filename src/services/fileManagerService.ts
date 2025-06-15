
import { toast } from "sonner";

export interface ManagedFile {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  rawSize: number;
  lastModified: string;
  uploadDate: string;
  projectId: string;
  file: File;
  tags: string[];
  description?: string;
  metadata?: {
    dimensions?: string;
    resolution?: string;
    duration?: string;
    [key: string]: any;
  };
}

export interface FileSearchOptions {
  searchTerm?: string;
  category?: string;
  fileType?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

class FileManagerService {
  private files: ManagedFile[] = [];
  private storageKey = 'architect_ai_files';

  constructor() {
    this.loadFiles();
  }

  // Load files from localStorage
  private loadFiles(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const fileData = JSON.parse(stored);
        // Note: We can't restore the actual File objects from localStorage
        // In a real app, you'd store files in a proper file storage service
        this.files = fileData;
      }
    } catch (error) {
      console.error('Error loading files from storage:', error);
    }
  }

  // Save file metadata to localStorage
  private saveFiles(): void {
    try {
      // Store file metadata without the actual File objects
      const fileMetadata = this.files.map(file => ({
        ...file,
        file: null // Remove file object for storage
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(fileMetadata));
    } catch (error) {
      console.error('Error saving files to storage:', error);
    }
  }

  // Add files to the knowledge base
  addFiles(files: File[]): ManagedFile[] {
    const newFiles = files.map(file => {
      const managedFile: ManagedFile = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        type: this.getFileType(file.name),
        category: this.getFileCategory(file.name),
        size: this.formatFileSize(file.size),
        rawSize: file.size,
        lastModified: 'Just now',
        uploadDate: new Date().toISOString(),
        projectId: 'default',
        file: file,
        tags: [],
        description: '',
        metadata: this.extractMetadata(file)
      };

      return managedFile;
    });

    this.files.push(...newFiles);
    this.saveFiles();

    toast.success(`Added ${newFiles.length} file(s) to knowledge base`);
    return newFiles;
  }

  // Remove a file
  removeFile(fileId: string): boolean {
    const index = this.files.findIndex(f => f.id === fileId);
    if (index !== -1) {
      const removedFile = this.files.splice(index, 1)[0];
      this.saveFiles();
      toast.success(`Removed ${removedFile.name} from knowledge base`);
      return true;
    }
    return false;
  }

  // Get all files
  getFiles(): ManagedFile[] {
    return this.files;
  }

  // Search files
  searchFiles(options: FileSearchOptions): ManagedFile[] {
    return this.files.filter(file => {
      if (options.searchTerm && !file.name.toLowerCase().includes(options.searchTerm.toLowerCase())) {
        return false;
      }
      if (options.category && options.category !== 'All' && file.category !== options.category) {
        return false;
      }
      if (options.fileType && file.type !== options.fileType) {
        return false;
      }
      if (options.tags && options.tags.length > 0) {
        const hasMatchingTag = options.tags.some(tag => file.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }

  // Get files by category
  getFilesByCategory(category: string): ManagedFile[] {
    return this.files.filter(file => file.category === category);
  }

  // Get files by type
  getFilesByType(type: string): ManagedFile[] {
    return this.files.filter(file => file.type === type);
  }

  // Get file by ID
  getFileById(id: string): ManagedFile | undefined {
    return this.files.find(file => file.id === id);
  }

  // Update file metadata
  updateFile(fileId: string, updates: Partial<ManagedFile>): boolean {
    const index = this.files.findIndex(f => f.id === fileId);
    if (index !== -1) {
      this.files[index] = { ...this.files[index], ...updates };
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Add tags to a file
  addTags(fileId: string, tags: string[]): boolean {
    const file = this.getFileById(fileId);
    if (file) {
      const newTags = tags.filter(tag => !file.tags.includes(tag));
      file.tags.push(...newTags);
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Remove tags from a file
  removeTags(fileId: string, tags: string[]): boolean {
    const file = this.getFileById(fileId);
    if (file) {
      file.tags = file.tags.filter(tag => !tags.includes(tag));
      this.saveFiles();
      return true;
    }
    return false;
  }

  // Get all unique categories
  getCategories(): string[] {
    const categories = new Set(this.files.map(f => f.category));
    return Array.from(categories).sort();
  }

  // Get all unique file types
  getFileTypes(): string[] {
    const types = new Set(this.files.map(f => f.type));
    return Array.from(types).sort();
  }

  // Get all unique tags
  getTags(): string[] {
    const tags = new Set(this.files.flatMap(f => f.tags));
    return Array.from(tags).sort();
  }

  // Get storage statistics
  getStorageStats() {
    const totalFiles = this.files.length;
    const totalSize = this.files.reduce((acc, file) => acc + file.rawSize, 0);
    const categoryStats = this.getCategories().map(category => ({
      category,
      count: this.files.filter(f => f.category === category).length,
      size: this.files.filter(f => f.category === category).reduce((acc, f) => acc + f.rawSize, 0)
    }));

    return {
      totalFiles,
      totalSize,
      formattedSize: this.formatFileSize(totalSize),
      categoryStats
    };
  }

  // Export file list as JSON
  exportFileList(): string {
    const exportData = this.files.map(file => ({
      name: file.name,
      type: file.type,
      category: file.category,
      size: file.size,
      uploadDate: file.uploadDate,
      tags: file.tags,
      description: file.description
    }));

    return JSON.stringify(exportData, null, 2);
  }

  // Helper methods
  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const typeMap: { [key: string]: string } = {
      'pdf': 'pdf',
      'dwg': 'dwg',
      'dxf': 'dxf',
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'bmp': 'image', 'svg': 'image', 'webp': 'image',
      'txt': 'txt',
      'md': 'md',
      'doc': 'doc', 'docx': 'docx',
      'xlsx': 'xlsx', 'xls': 'xls',
      'csv': 'csv',
      'zip': 'zip', 'rar': 'rar',
      'skp': 'skp',
      'ifc': 'ifc',
      'step': 'step', 'stp': 'step',
      'iges': 'iges', 'igs': 'iges',
      'stl': 'stl',
      'obj': 'obj',
      'fbx': 'fbx',
      'gltf': 'gltf',
      'glb': 'glb',
      'mp4': 'video', 'avi': 'video', 'mov': 'video', 'wmv': 'video', 'flv': 'video',
      'mp3': 'audio', 'wav': 'audio', 'flac': 'audio', 'aac': 'audio'
    };

    return typeMap[extension || ''] || 'unknown';
  }

  private getFileCategory(fileName: string): string {
    const type = this.getFileType(fileName);
    
    const categoryMap: { [key: string]: string } = {
      'dwg': 'CAD Files',
      'dxf': 'CAD Files',
      'skp': 'CAD Files',
      'ifc': 'CAD Files',
      'step': 'CAD Files',
      'iges': 'CAD Files',
      'stl': '3D Models',
      'obj': '3D Models',
      'fbx': '3D Models',
      'gltf': '3D Models',
      'glb': '3D Models',
      'pdf': 'Documents',
      'doc': 'Documents',
      'docx': 'Documents',
      'txt': 'Documents',
      'md': 'Documents',
      'xlsx': 'Spreadsheets',
      'xls': 'Spreadsheets',
      'csv': 'Spreadsheets',
      'image': 'Images',
      'zip': 'Archives',
      'rar': 'Archives',
      'video': 'Media',
      'audio': 'Media'
    };

    return categoryMap[type] || 'Other';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private extractMetadata(file: File): any {
    const metadata: any = {};
    
    // Extract basic metadata
    metadata.lastModified = new Date(file.lastModified).toISOString();
    metadata.type = file.type;
    
    // For images, we could extract dimensions (would need additional processing)
    if (file.type.startsWith('image/')) {
      // In a real app, you'd extract image dimensions here
      metadata.type = 'image';
    }
    
    // For videos, extract duration (would need additional processing)
    if (file.type.startsWith('video/')) {
      metadata.type = 'video';
    }
    
    return metadata;
  }
}

export const fileManagerService = new FileManagerService();
