import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  Trash2,
  Edit3,
  Layers,
  Box,
  Home,
  TreePine,
  Sofa
} from "lucide-react";

interface SceneObject {
  id: string;
  name: string;
  type: string;
  category: 'basic' | 'architecture' | 'furniture' | 'landscape' | 'ai-generated';
  visible: boolean;
  locked: boolean;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface SceneManagerProps {
  theme: 'dark' | 'light';
  objects: SceneObject[];
  onObjectUpdate: (id: string, updates: Partial<SceneObject>) => void;
  onObjectDelete: (id: string) => void;
  onObjectSelect: (id: string) => void;
  selectedObjectId?: string;
}

export const SceneManager = ({ 
  theme, 
  objects, 
  onObjectUpdate, 
  onObjectDelete, 
  onObjectSelect,
  selectedObjectId 
}: SceneManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return Box;
      case 'architecture': return Home;
      case 'furniture': return Sofa;
      case 'landscape': return TreePine;
      case 'ai-generated': return Edit3;
      default: return Box;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-500';
      case 'architecture': return 'bg-green-500';
      case 'furniture': return 'bg-orange-500';
      case 'landscape': return 'bg-emerald-500';
      case 'ai-generated': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEditStart = (obj: SceneObject) => {
    setEditingId(obj.id);
    setEditName(obj.name);
  };

  const handleEditSave = () => {
    if (editingId && editName.trim()) {
      onObjectUpdate(editingId, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const themeClasses = theme === 'light'
    ? 'bg-white border-stone-200 text-black'
    : 'bg-gray-800 border-gray-700 text-white';

  const buttonTheme = theme === 'light'
    ? 'hover:bg-stone-50'
    : 'hover:bg-gray-700';

  const categoryHeaderBg = theme === 'light'
    ? 'bg-stone-50'
    : 'bg-gray-900';

  const selectedBg = theme === 'light'
    ? 'border-blue-500 bg-blue-50'
    : 'border-blue-500 bg-blue-900/20';

  const itemBg = theme === 'light'
    ? 'border-stone-200 hover:bg-stone-50'
    : 'border-gray-700 hover:bg-gray-800';

  const groupedObjects = objects.reduce((acc, obj) => {
    if (!acc[obj.category]) acc[obj.category] = [];
    acc[obj.category].push(obj);
    return acc;
  }, {} as Record<string, SceneObject[]>);

  return (
    <Card className={`w-80 h-full ${themeClasses}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            <h3 className="font-semibold">Scene Objects</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {objects.length} items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
        {Object.keys(groupedObjects).length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm opacity-70">No objects in scene</p>
            <p className="text-xs opacity-50 mt-1">Add objects using the tools or AI generator</p>
          </div>
        ) : (
          Object.entries(groupedObjects).map(([category, categoryObjects]) => {
            const CategoryIcon = getCategoryIcon(category);
            
            return (
              <div key={category} className="mb-4">
                <div className={`px-4 py-2 ${categoryHeaderBg}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                    <CategoryIcon className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">
                      {category.replace('-', ' ')} ({categoryObjects.length})
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2 space-y-2">
                  {categoryObjects.map((obj) => (
                    <div
                      key={obj.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedObjectId === obj.id
                          ? selectedBg
                          : itemBg
                      }`}
                      onClick={() => onObjectSelect(obj.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {editingId === obj.id ? (
                            <div className="flex gap-1">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-6 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditSave();
                                  if (e.key === 'Escape') handleEditCancel();
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={handleEditSave}
                                className="h-6 px-2"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium text-sm truncate">{obj.name}</div>
                              <div className="text-xs opacity-70">{obj.type}</div>
                              <div className="text-xs opacity-50">
                                x:{obj.position.x.toFixed(1)} y:{obj.position.y.toFixed(1)} z:{obj.position.z.toFixed(1)}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onObjectUpdate(obj.id, { visible: !obj.visible });
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {obj.visible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 opacity-50" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onObjectUpdate(obj.id, { locked: !obj.locked });
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {obj.locked ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Unlock className="h-3 w-3 opacity-50" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(obj);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onObjectDelete(obj.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
