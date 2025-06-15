
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Download } from "lucide-react";

const expandedTemplates = [
  {
    id: 1,
    name: "Modern Single Family Home",
    description: "Contemporary 3-bedroom house with open floor plan",
    thumbnail: "🏠",
    category: "residential",
    specs: "2,400 sq ft, 3BR/2BA, 2-car garage",
    features: ["Open kitchen", "Master suite", "Covered patio", "Energy efficient"],
    price: "Est. $420,000"
  },
  {
    id: 2,
    name: "Urban Townhouse",
    description: "Multi-story townhouse for urban living",
    thumbnail: "🏘️",
    category: "residential", 
    specs: "1,800 sq ft, 2BR/2.5BA, 3 stories",
    features: ["Rooftop deck", "Street parking", "Modern finishes", "City views"],
    price: "Est. $380,000"
  },
  {
    id: 3,
    name: "Office Building Complex",
    description: "Multi-tenant commercial office space",
    thumbnail: "🏢",
    category: "commercial",
    specs: "25,000 sq ft, 5 floors, parking garage",
    features: ["HVAC system", "Elevator", "Conference rooms", "Retail space"],
    price: "Est. $2,100,000"
  },
  {
    id: 4,
    name: "Retail Shopping Center",
    description: "Strip mall with multiple retail units",
    thumbnail: "🏬",
    category: "commercial",
    specs: "15,000 sq ft, 8 units, ample parking",
    features: ["Anchor tenant space", "Outdoor seating", "LED lighting", "Security system"],
    price: "Est. $1,350,000"
  },
  {
    id: 5,
    name: "Warehouse Distribution",
    description: "Industrial warehouse with loading docks",
    thumbnail: "🏭",
    category: "industrial",
    specs: "50,000 sq ft, 30ft ceilings, 12 docks",
    features: ["Crane system", "Fire sprinklers", "LED high bays", "Office space"],
    price: "Est. $1,800,000"
  },
  {
    id: 6,
    name: "Apartment Complex",
    description: "Multi-family residential complex",
    thumbnail: "🏨",
    category: "residential",
    specs: "24 units, 2-3BR, community amenities",
    features: ["Pool", "Fitness center", "Laundry facility", "Playground"],
    price: "Est. $3,200,000"
  },
  {
    id: 7,
    name: "Medical Office Building",
    description: "Healthcare facility with multiple suites",
    thumbnail: "🏥",
    category: "commercial",
    specs: "12,000 sq ft, 8 suites, medical grade",
    features: ["Exam rooms", "Waiting areas", "Lab space", "Pharmacy"],
    price: "Est. $1,440,000"
  },
  {
    id: 8,
    name: "Steel Frame Structure",
    description: "Heavy-duty steel construction template",
    thumbnail: "🔧",
    category: "structural",
    specs: "Custom sizing, wind/seismic rated",
    features: ["W-beam framing", "Moment connections", "Fire rating", "Expansion joints"],
    price: "Est. $850,000"
  },
  {
    id: 9,
    name: "Luxury Villa",
    description: "High-end residential with premium finishes",
    thumbnail: "🏖️",
    category: "residential",
    specs: "4,500 sq ft, 4BR/3.5BA, pool",
    features: ["Chef's kitchen", "Wine cellar", "Home theater", "Guest house"],
    price: "Est. $1,250,000"
  },
  {
    id: 10,
    name: "School Building",
    description: "Educational facility with classrooms",
    thumbnail: "🏫",
    category: "institutional",
    specs: "35,000 sq ft, 20 classrooms, cafeteria",
    features: ["Computer lab", "Library", "Gymnasium", "Playground"],
    price: "Est. $4,200,000"
  },
  {
    id: 11,
    name: "Restaurant",
    description: "Full-service restaurant with kitchen",
    thumbnail: "🍽️",
    category: "commercial",
    specs: "3,500 sq ft, seats 120, full kitchen",
    features: ["Bar area", "Private dining", "Patio seating", "Wine storage"],
    price: "Est. $525,000"
  },
  {
    id: 12,
    name: "Mixed-Use Development",
    description: "Combined residential and commercial space",
    thumbnail: "🌆",
    category: "mixed-use",
    specs: "45,000 sq ft, retail + 30 units",
    features: ["Ground floor retail", "Residential above", "Parking garage", "Rooftop amenities"],
    price: "Est. $5,400,000"
  }
];

const categoryColors = {
  residential: "bg-purple-500/20 text-purple-400",
  commercial: "bg-cyan-500/20 text-cyan-400", 
  industrial: "bg-orange-500/20 text-orange-400",
  structural: "bg-red-500/20 text-red-400",
  institutional: "bg-green-500/20 text-green-400",
  "mixed-use": "bg-blue-500/20 text-blue-400"
};

export const TemplateLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const filteredTemplates = expandedTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "residential", "commercial", "industrial", "structural", "institutional", "mixed-use"];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Professional Template Library</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{template.thumbnail}</div>
                  <h3 className="text-white font-medium text-sm">{template.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">{template.description}</p>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="text-gray-300">{template.specs}</div>
                  <div className="text-green-400 font-medium">{template.price}</div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <Badge className={`text-xs ${categoryColors[template.category as keyof typeof categoryColors]}`}>
                    {template.category}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedTemplate(template)}
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {selectedTemplate.name}
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedTemplate.thumbnail}</div>
                <p className="text-gray-300">{selectedTemplate.description}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Specifications</h4>
                <p className="text-gray-300">{selectedTemplate.specs}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Key Features</h4>
                <ul className="text-gray-300 space-y-1">
                  {selectedTemplate.features.map((feature: string, index: number) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Cost Estimate</h4>
                <p className="text-green-400 text-xl font-bold">{selectedTemplate.price}</p>
                <p className="text-gray-400 text-sm">Based on current market rates</p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Plans
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
