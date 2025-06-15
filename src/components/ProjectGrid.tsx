
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, MoreHorizontal } from "lucide-react";
import { mockProjects } from "@/lib/database";

const statusColors = {
  draft: "bg-gray-500/20 text-gray-400",
  'in-progress': "bg-blue-500/20 text-blue-400",
  review: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400"
};

const typeColors = {
  residential: "bg-purple-500/20 text-purple-400",
  commercial: "bg-cyan-500/20 text-cyan-400",
  industrial: "bg-orange-500/20 text-orange-400",
  institutional: "bg-emerald-500/20 text-emerald-400"
};

export const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProjects.map((project) => (
        <Card key={project.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-white text-lg font-medium line-clamp-1">
                {project.name}
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${statusColors[project.status]}`}>
                {project.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge className={`text-xs ${typeColors[project.type]}`}>
                {project.type.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-3 w-3 mr-2" />
                {project.location}
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-3 w-3 mr-2" />
                {project.client}
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-3 w-3 mr-2" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </div>
              {project.budget && (
                <div className="flex items-center text-gray-400">
                  <DollarSign className="h-3 w-3 mr-2" />
                  ${project.budget.toLocaleString()}
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{project.area.toLocaleString()} sq ft</span>
                <span>ID: {project.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
