
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  User, 
  Monitor, 
  Shield, 
  Bell, 
  Palette, 
  Download, 
  Database,
  Key,
  Globe,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";

export const SettingsPage = () => {
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [openAIKey, setOpenAIKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage
    const savedOpenAIKey = localStorage.getItem('openai_api_key');
    const savedAnthropicKey = localStorage.getItem('anthropic_api_key');
    if (savedOpenAIKey) setOpenAIKey(savedOpenAIKey);
    if (savedAnthropicKey) setAnthropicKey(savedAnthropicKey);
  }, []);

  const saveAPIKeys = () => {
    localStorage.setItem('openai_api_key', openAIKey);
    localStorage.setItem('anthropic_api_key', anthropicKey);
    toast.success("API keys saved successfully!");
  };

  const clearAPIKeys = () => {
    setOpenAIKey("");
    setAnthropicKey("");
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('anthropic_api_key');
    toast.success("API keys cleared!");
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your CAD Hub experience and manage your preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input id="firstName" defaultValue="Corey" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input id="lastName" defaultValue="Hilton" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" defaultValue="corey.hilton@cadhub.com" className="bg-gray-900 border-gray-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Professional Title</Label>
                  <Input id="title" defaultValue="Senior Architect" className="bg-gray-900 border-gray-600 text-white" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates about your projects via email</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Auto-save Projects</Label>
                    <p className="text-sm text-gray-500">Automatically save your work every 5 minutes</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Theme & Display</CardTitle>
                <CardDescription>Customize the visual appearance of CAD Hub</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">3D Workspace</CardTitle>
                <CardDescription>Configure your 3D modeling environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Grid Size</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5 units</SelectItem>
                      <SelectItem value="1">1 unit</SelectItem>
                      <SelectItem value="2">2 units</SelectItem>
                      <SelectItem value="5">5 units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Default Units</Label>
                  <Select defaultValue="meters">
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="feet">Feet</SelectItem>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="millimeters">Millimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  AI API Keys
                </CardTitle>
                <CardDescription>Manage your API keys for AI-powered CAD generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">OpenAI API Key</Label>
                    <div className="relative">
                      <Input 
                        type={showOpenAIKey ? "text" : "password"}
                        placeholder="sk-..." 
                        value={openAIKey}
                        onChange={(e) => setOpenAIKey(e.target.value)}
                        className="bg-gray-900 border-gray-600 text-white pr-10" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      >
                        {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Used for text-to-CAD generation</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Anthropic API Key</Label>
                    <div className="relative">
                      <Input 
                        type={showAnthropicKey ? "text" : "password"}
                        placeholder="sk-ant-..." 
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                        className="bg-gray-900 border-gray-600 text-white pr-10" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                      >
                        {showAnthropicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Used for image-to-CAD analysis and generation</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveAPIKeys} className="bg-cyan-600 hover:bg-cyan-500">
                    Save API Keys
                  </Button>
                  <Button variant="outline" onClick={clearAPIKeys} className="border-gray-600 text-gray-300 hover:text-white">
                    Clear Keys
                  </Button>
                </div>

                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">API Key Information</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• OpenAI keys are used for natural language processing and CAD generation</li>
                    <li>• Anthropic keys are used for advanced image analysis and interpretation</li>
                    <li>• Keys are stored locally in your browser and never sent to our servers</li>
                    <li>• You can get OpenAI keys from platform.openai.com</li>
                    <li>• You can get Anthropic keys from console.anthropic.com</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Advanced settings for data and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-white border-gray-600 hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  Export All Projects
                </Button>
                <Button variant="outline" className="w-full justify-start text-white border-gray-600 hover:bg-gray-700">
                  <Database className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
            Reset to Defaults
          </Button>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
