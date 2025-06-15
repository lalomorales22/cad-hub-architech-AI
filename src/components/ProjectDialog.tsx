
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id?: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'institutional';
  status: 'draft' | 'in-progress' | 'review' | 'completed';
  location: string;
  client: string;
  area: number;
  budget?: number;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

export const ProjectDialog = ({ open, onOpenChange, onSave, project }: ProjectDialogProps) => {
  const [formData, setFormData] = useState<Project>({
    name: "",
    description: "",
    type: "residential",
    status: "draft",
    location: "",
    client: "",
    area: 0,
    budget: undefined,
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: "",
        description: "",
        type: "residential",
        status: "draft",
        location: "",
        client: "",
        area: 0,
        budget: undefined,
      });
    }
  }, [project, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange("area", parseInt(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (optional)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => handleInputChange("budget", e.target.value ? parseInt(e.target.value) : undefined)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
