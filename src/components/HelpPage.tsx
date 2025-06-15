
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  Book, 
  MessageSquare, 
  Video, 
  FileText, 
  ExternalLink,
  Lightbulb,
  Users,
  Zap,
  Monitor,
  Palette,
  Code
} from "lucide-react";

export const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quickActions = [
    { icon: Video, title: "Video Tutorials", description: "Learn with step-by-step video guides", badge: "Popular" },
    { icon: Book, title: "Documentation", description: "Complete reference guide", badge: null },
    { icon: MessageSquare, title: "Community Forum", description: "Connect with other architects", badge: "Active" },
    { icon: FileText, title: "API Reference", description: "Technical documentation", badge: null },
  ];

  const tutorials = [
    { title: "Getting Started with CAD Hub", duration: "5 min", difficulty: "Beginner" },
    { title: "Creating Your First 3D Model", duration: "15 min", difficulty: "Beginner" },
    { title: "Using Text-to-CAD Features", duration: "10 min", difficulty: "Intermediate" },
    { title: "Advanced 3D Modeling Techniques", duration: "25 min", difficulty: "Advanced" },
    { title: "Exporting and Sharing Projects", duration: "8 min", difficulty: "Beginner" },
  ];

  const faqs = [
    {
      question: "How do I start a new project?",
      answer: "Click the '+' button in the top toolbar or navigate to Projects and select 'New Project'. You can choose from templates or start with a blank canvas."
    },
    {
      question: "What file formats can I export to?",
      answer: "CAD Hub supports exporting to STL, OBJ, GLTF, and FBX formats. You can also export 2D plans as PDF or DWG files."
    },
    {
      question: "How does Text-to-CAD work?",
      answer: "Simply describe what you want to create in natural language, and our AI will generate a 3D model based on your description. You can then refine and modify the generated model."
    },
    {
      question: "Can I collaborate with team members?",
      answer: "Yes! CAD Hub Pro includes real-time collaboration features. You can invite team members to view and edit projects together."
    },
    {
      question: "How do I save my work?",
      answer: "Your work is automatically saved every 5 minutes. You can also manually save by pressing Ctrl+S or clicking the save button in the toolbar."
    }
  ];

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-gray-400">Find answers, tutorials, and get the help you need</p>
        </div>

        {/* Search */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for help topics, tutorials, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <action.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                  {action.title}
                  {action.badge && (
                    <Badge variant="secondary" className="bg-cyan-600 text-white text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="tutorials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="shortcuts" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Shortcuts
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Video Tutorials</CardTitle>
                <CardDescription>Learn CAD Hub with our comprehensive video guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tutorials.map((tutorial, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{tutorial.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{tutorial.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                      <AccordionTrigger className="text-white hover:text-cyan-400">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Keyboard Shortcuts</CardTitle>
                <CardDescription>Speed up your workflow with these handy shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      3D Workspace
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rotate View</span>
                        <span className="text-white font-mono">Middle Mouse</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pan View</span>
                        <span className="text-white font-mono">Shift + Middle Mouse</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Zoom</span>
                        <span className="text-white font-mono">Scroll Wheel</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reset View</span>
                        <span className="text-white font-mono">Numpad 7</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      General
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Save Project</span>
                        <span className="text-white font-mono">Ctrl + S</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">New Project</span>
                        <span className="text-white font-mono">Ctrl + N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Undo</span>
                        <span className="text-white font-mono">Ctrl + Z</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Redo</span>
                        <span className="text-white font-mono">Ctrl + Y</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Get Support
                  </CardTitle>
                  <CardDescription>Need personalized help? Contact our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-700">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community
                  </CardTitle>
                  <CardDescription>Connect with other CAD Hub users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-700">
                    Join Discord
                  </Button>
                  <Button variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-700">
                    Browse Forum
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
