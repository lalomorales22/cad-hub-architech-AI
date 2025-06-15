
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { mockTemplates } from "@/lib/database";

const categoryColors = {
  residential: "bg-purple-500/20 text-purple-400",
  commercial: "bg-cyan-500/20 text-cyan-400",
  structural: "bg-orange-500/20 text-orange-400"
};

export const TemplateLibrary = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Template Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTemplates.map((template) => (
            <div key={template.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{template.thumbnail}</div>
                <h3 className="text-white font-medium text-sm">{template.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{template.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${categoryColors[template.category]}`}>
                  {template.category}
                </Badge>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  <Plus className="h-3 w-3 mr-1" />
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
