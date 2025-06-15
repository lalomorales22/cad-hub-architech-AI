interface Project {
  id: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'institutional';
  status: 'draft' | 'in-progress' | 'review' | 'completed';
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  location: string;
  client: string;
  area: number;
  budget?: number;
}

interface RecentFile {
  id: string;
  name: string;
  type: 'dwg' | 'pdf' | '3d' | 'image';
  size: string;
  lastModified: string;
  projectId: string;
}

interface Template {
  id: string;
  name: string;
  category: 'residential' | 'commercial' | 'structural';
  description: string;
  thumbnail: string;
}

// Mock data
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Ocean Beach Residence',
    description: 'Modern two-story residence with clean lines and large windows',
    type: 'residential',
    status: 'in-progress',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    location: 'San Diego, CA',
    client: 'Johnson Family',
    area: 3200,
    budget: 850000
  },
  {
    id: '2',
    name: 'Downtown Office Complex',
    description: 'Mixed-use commercial building with retail and office spaces',
    type: 'commercial',
    status: 'review',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    location: 'Los Angeles, CA',
    client: 'Urban Development Corp',
    area: 15000,
    budget: 4200000
  },
  {
    id: '3',
    name: 'Sustainable Community Center',
    description: 'LEED certified community facility with solar integration',
    type: 'institutional',
    status: 'completed',
    createdAt: '2023-11-05',
    updatedAt: '2024-01-12',
    location: 'Portland, OR',
    client: 'City of Portland',
    area: 8500,
    budget: 2100000
  },
  {
    id: '4',
    name: 'Industrial Warehouse Expansion',
    description: 'Warehouse facility expansion with automated systems',
    type: 'industrial',
    status: 'draft',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    location: 'Phoenix, AZ',
    client: 'LogiTech Solutions',
    area: 25000,
    budget: 1800000
  },
  {
    id: '5',
    name: 'Mountain Retreat House',
    description: 'Eco-friendly cabin design with panoramic views',
    type: 'residential',
    status: 'in-progress',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-19',
    location: 'Aspen, CO',
    client: 'Miller Estate',
    area: 2800,
    budget: 650000
  }
];

// Clear the mock files array
export const mockRecentFiles: RecentFile[] = [];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Single Family Home',
    category: 'residential',
    description: 'Standard 2-3 bedroom house layout',
    thumbnail: '🏠'
  },
  {
    id: '2',
    name: 'Office Building',
    category: 'commercial',
    description: 'Multi-story office space template',
    thumbnail: '🏢'
  },
  {
    id: '3',
    name: 'Apartment Complex',
    category: 'residential',
    description: 'Multi-unit residential building',
    thumbnail: '🏬'
  },
  {
    id: '4',
    name: 'Retail Store',
    category: 'commercial',
    description: 'Commercial retail space layout',
    thumbnail: '🏪'
  },
  {
    id: '5',
    name: 'Steel Frame Structure',
    category: 'structural',
    description: 'Industrial steel framework',
    thumbnail: '🏗️'
  }
];

// Simple in-memory storage for now (would be replaced with SQLite in production)
export class DatabaseManager {
  static getProjects(): Project[] {
    return mockProjects;
  }

  static getProject(id: string): Project | undefined {
    return mockProjects.find(p => p.id === id);
  }

  static getRecentFiles(): RecentFile[] {
    return mockRecentFiles;
  }

  static getTemplates(): Template[] {
    return mockTemplates;
  }

  static updateProject(id: string, updates: Partial<Project>): void {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects[index] = { ...mockProjects[index], ...updates, updatedAt: new Date().toISOString() };
    }
  }
}
