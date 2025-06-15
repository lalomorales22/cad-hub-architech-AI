
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Upload, Wand2, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { advancedAI } from "@/services/advancedAIServices";
import { toast } from "sonner";

interface AIAgentProps {
  theme: 'dark' | 'light';
  onGenerateComplete?: (cadData: any) => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  provider?: string;
  result?: any;
}

export const AIAgent = ({ theme, onGenerateComplete }: AIAgentProps) => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const workflows = [
    {
      id: "image-to-3d",
      name: "Image to 3D Model",
      description: "Upload an image and convert it to a 3D model",
      steps: [
        { id: "analyze", name: "Analyze Image", description: "Understanding image content with Stability AI", provider: "stability" },
        { id: "enhance", name: "Enhance Description", description: "Creating detailed 3D prompt", provider: "agent" },
        { id: "generate", name: "Generate 3D", description: "Creating 3D model with Fal.AI", provider: "fal" },
        { id: "optimize", name: "Optimize Model", description: "Refining geometry with Replicate", provider: "replicate" }
      ]
    },
    {
      id: "text-to-scene",
      name: "Text to Complete Scene",
      description: "Create a full architectural scene from description",
      steps: [
        { id: "parse", name: "Parse Requirements", description: "Understanding architectural needs", provider: "agent" },
        { id: "structure", name: "Generate Structure", description: "Creating main structure with DeepMind analysis", provider: "deepmind" },
        { id: "details", name: "Add Details", description: "Adding architectural details with Fal.AI", provider: "fal" },
        { id: "textures", name: "Apply Textures", description: "Creating realistic materials with Stability AI", provider: "stability" }
      ]
    },
    {
      id: "concept-to-reality",
      name: "Concept to Reality",
      description: "Transform rough concept into detailed architectural model",
      steps: [
        { id: "concept", name: "Concept Analysis", description: "Analyzing design concept", provider: "agent" },
        { id: "sketch", name: "Generate Sketches", description: "Creating multiple design variations with Stability AI", provider: "stability" },
        { id: "select", name: "Auto-Select Best", description: "Choosing optimal design with AI analysis", provider: "agent" },
        { id: "model", name: "Create 3D Model", description: "Building final 3D model with Fal.AI", provider: "fal" }
      ]
    }
  ];

  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);

  const executeWorkflow = async () => {
    if (!prompt.trim() && !imageUrl.trim()) {
      toast.error("Please provide input for the workflow");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCurrentStep(0);

    const steps: WorkflowStep[] = selectedWorkflow.steps.map(step => ({
      ...step,
      status: 'pending'
    }));
    setWorkflow(steps);

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        setWorkflow(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'running' } : step
        ));

        // Simulate API calls with different providers
        await new Promise(resolve => setTimeout(resolve, 2000));

        let stepResult;
        switch (steps[i].provider) {
          case 'stability':
            stepResult = await simulateStabilityCall(steps[i].id, prompt, imageUrl);
            break;
          case 'fal':
            stepResult = await simulateFalCall(steps[i].id, prompt);
            break;
          case 'replicate':
            stepResult = await simulateReplicateCall(steps[i].id, prompt);
            break;
          case 'deepmind':
            stepResult = await simulateDeepMindCall(steps[i].id, prompt);
            break;
          default:
            stepResult = await simulateAgentCall(steps[i].id, prompt);
        }

        setWorkflow(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'completed', result: stepResult } : step
        ));

        setProgress(((i + 1) / steps.length) * 100);
      }

      // Create final CAD data
      const finalResult = {
        id: crypto.randomUUID(),
        description: `AI Agent: ${selectedWorkflow.name} - ${prompt}`,
        coordinates: [],
        shapes: [
          {
            type: 'complex',
            position: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1},
            rotation: {x: 0, y: 0, z: 0}
          }
        ],
        metadata: {
          workflow: selectedWorkflow.id,
          steps: workflow,
          prompt,
          imageUrl,
          timestamp: new Date().toISOString(),
          agent_generated: true
        }
      };

      if (onGenerateComplete) {
        onGenerateComplete(finalResult);
      }

      toast.success("AI Agent workflow completed successfully!");
    } catch (error) {
      console.error('Workflow error:', error);
      toast.error("Workflow failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulation functions for different providers
  const simulateStabilityCall = async (stepId: string, prompt: string, imageUrl?: string) => {
    // Simulate Stability AI call
    return { stepId, provider: 'stability', data: 'Image analysis complete' };
  };

  const simulateFalCall = async (stepId: string, prompt: string) => {
    // Simulate Fal.AI call
    return { stepId, provider: 'fal', data: '3D model generated' };
  };

  const simulateReplicateCall = async (stepId: string, prompt: string) => {
    // Simulate Replicate call
    return { stepId, provider: 'replicate', data: 'Model optimized' };
  };

  const simulateDeepMindCall = async (stepId: string, prompt: string) => {
    // Simulate DeepMind call
    return { stepId, provider: 'deepmind', data: 'Structural analysis complete' };
  };

  const simulateAgentCall = async (stepId: string, prompt: string) => {
    // Simulate AI Agent processing
    return { stepId, provider: 'agent', data: 'AI processing complete' };
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const themeClasses = theme === 'light'
    ? 'bg-white text-black'
    : 'bg-gray-900 text-white';

  return (
    <div className={`h-full p-6 overflow-y-auto ${themeClasses}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">AI Agent Studio</h1>
          </div>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Autonomous AI workflows that combine multiple providers for complex tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedWorkflow.id === workflow.id 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              } ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{workflow.name}</h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {workflow.description}
                </p>
                <div className="flex gap-1 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {workflow.steps.length} steps
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800'}>
          <CardHeader>
            <h3 className="font-semibold">Configure Workflow: {selectedWorkflow.name}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agent-prompt">Description</Label>
              <Textarea
                id="agent-prompt"
                placeholder="Describe what you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="agent-image">Reference Image URL (optional)</Label>
              <Input
                id="agent-image"
                placeholder="https://example.com/reference.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {isProcessing && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  {workflow.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        index === currentStep ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {getStatusIcon(step.status)}
                      <div className="flex-1">
                        <div className="font-medium">{step.name}</div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {step.provider}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={executeWorkflow}
              disabled={isProcessing || (!prompt.trim() && !imageUrl.trim())}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Running Workflow...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Start AI Agent Workflow
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
