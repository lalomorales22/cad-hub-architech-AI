
import { toast } from "sonner";

export interface TextToCADRequest {
  prompt: string;
  style?: string;
  complexity?: string;
}

export interface ImageToCADRequest {
  imageUrl: string;
  prompt?: string;
  analysisType?: string;
}

export interface CADGenerationResult {
  id: string;
  description: string;
  coordinates: Array<{x: number, y: number, z: number}>;
  shapes: Array<{
    type: 'cube' | 'sphere' | 'cylinder' | 'plane';
    position: {x: number, y: number, z: number};
    scale: {x: number, y: number, z: number};
    rotation?: {x: number, y: number, z: number};
  }>;
  metadata: {
    prompt: string;
    timestamp: string;
    model: string;
  };
}

class AIService {
  private getOpenAIKey(): string | null {
    return localStorage.getItem('openai_api_key');
  }

  private getAnthropicKey(): string | null {
    return localStorage.getItem('anthropic_api_key');
  }

  async generateCADFromText(request: TextToCADRequest): Promise<CADGenerationResult> {
    const apiKey = this.getOpenAIKey();
    if (!apiKey) {
      toast.error("OpenAI API key not found. Please add it in Settings.");
      throw new Error("OpenAI API key required");
    }

    try {
      const systemPrompt = `You are a CAD generation assistant. Convert text descriptions into 3D CAD model data. 

IMPORTANT: Return ONLY valid JSON, no markdown or explanations.

Return a JSON object with this exact structure:
{
  "description": "Brief description of the model",
  "coordinates": [],
  "shapes": [
    {
      "type": "cube|sphere|cylinder|plane",
      "position": {"x": number, "y": number, "z": number},
      "scale": {"x": number, "y": number, "z": number},
      "rotation": {"x": number, "y": number, "z": number}
    }
  ]
}

Examples:
For "simple house": 
{
  "description": "Simple house with walls and roof",
  "coordinates": [],
  "shapes": [
    {"type": "cube", "position": {"x": 0, "y": 1, "z": 0}, "scale": {"x": 4, "y": 2, "z": 3}},
    {"type": "cube", "position": {"x": 0, "y": 3.5, "z": 0}, "scale": {"x": 4.5, "y": 1, "z": 3.5}, "rotation": {"x": 0, "y": 0, "z": 0}}
  ]
}

For "table and chair":
{
  "description": "Table with chair",
  "coordinates": [],
  "shapes": [
    {"type": "cube", "position": {"x": 0, "y": 1.5, "z": 0}, "scale": {"x": 2, "y": 0.1, "z": 1}},
    {"type": "cube", "position": {"x": -0.8, "y": 0.5, "z": -0.4}, "scale": {"x": 0.1, "y": 1, "z": 0.1}},
    {"type": "cube", "position": {"x": 0.8, "y": 0.5, "z": -0.4}, "scale": {"x": 0.1, "y": 1, "z": 0.1}},
    {"type": "cube", "position": {"x": -0.8, "y": 0.5, "z": 0.4}, "scale": {"x": 0.1, "y": 1, "z": 0.1}},
    {"type": "cube", "position": {"x": 0.8, "y": 0.5, "z": 0.4}, "scale": {"x": 0.1, "y": 1, "z": 0.1}},
    {"type": "cube", "position": {"x": 2.5, "y": 0.75, "z": 0}, "scale": {"x": 0.5, "y": 0.1, "z": 0.5}},
    {"type": "cube", "position": {"x": 2.5, "y": 1.5, "z": 0.2}, "scale": {"x": 0.5, "y": 1, "z": 0.1}}
  ]
}

Create realistic 3D models with proper proportions. Use multiple shapes to create complex objects.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Generate a 3D CAD model for: ${request.prompt}. Style: ${request.style || 'modern'}. Complexity: ${request.complexity || 'medium'}. Return only valid JSON.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      let cadData;
      try {
        // Clean up the response in case there's markdown
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        cadData = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError, 'Content:', content);
        // Create a fallback structure
        cadData = {
          description: request.prompt,
          coordinates: [],
          shapes: [
            {
              type: 'cube',
              position: {x: 0, y: 0.5, z: 0},
              scale: {x: 1, y: 1, z: 1}
            }
          ]
        };
      }

      return {
        id: crypto.randomUUID(),
        ...cadData,
        metadata: {
          prompt: request.prompt,
          timestamp: new Date().toISOString(),
          model: 'gpt-4.1-2025-04-14'
        }
      };
    } catch (error) {
      console.error('Text-to-CAD generation error:', error);
      toast.error("Failed to generate CAD from text");
      throw error;
    }
  }

  async generateCADFromImage(request: ImageToCADRequest): Promise<CADGenerationResult> {
    const apiKey = this.getOpenAIKey();
    if (!apiKey) {
      toast.error("OpenAI API key not found. Please add it in Settings.");
      throw new Error("OpenAI API key required");
    }

    console.log('Starting image-to-CAD generation with:', {
      hasImage: !!request.imageUrl,
      prompt: request.prompt,
      analysisType: request.analysisType
    });

    try {
      // Convert image to base64 if needed
      const imageBase64 = await this.imageUrlToBase64(request.imageUrl);
      
      const systemPrompt = `You are a CAD generation assistant. Analyze this image and convert it into 3D CAD model data.

CRITICAL: You MUST return ONLY valid JSON with NO other text, explanations, or markdown formatting.

Return this exact JSON structure:
{
  "description": "Brief description of what you see in the image",
  "coordinates": [],
  "shapes": [
    {
      "type": "cube|sphere|cylinder|plane",
      "position": {"x": number, "y": number, "z": number},
      "scale": {"x": number, "y": number, "z": number},
      "rotation": {"x": number, "y": number, "z": number}
    }
  ]
}

Focus on the main structural elements visible in the image. Create realistic 3D representations using basic shapes. If you see a building, create walls, roof, etc. If you see furniture, create the main components.

IMPORTANT: Return ONLY the JSON object, nothing else.`;
      
      const userPrompt = `Analyze this architectural image and convert it into 3D CAD model data. ${request.prompt ? `Additional context: ${request.prompt}` : ''} 

Create a detailed 3D model with multiple shapes representing the main structural elements you can identify. Return ONLY the JSON object.`;

      console.log('Making OpenAI API request...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 2000,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: userPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log('OpenAI response content:', content);
      
      // Parse the JSON response with better error handling
      let cadData;
      try {
        // Clean up the response in case there's markdown or extra text
        let cleanContent = content.trim();
        
        // Remove markdown code blocks if present
        cleanContent = cleanContent.replace(/```json\s*|\s*```/g, '');
        cleanContent = cleanContent.replace(/```\s*|\s*```/g, '');
        
        // Find JSON object in the response
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanContent = jsonMatch[0];
        }
        
        console.log('Cleaned content for parsing:', cleanContent);
        cadData = JSON.parse(cleanContent);
        
        // Validate the structure
        if (!cadData.shapes || !Array.isArray(cadData.shapes)) {
          throw new Error('Invalid CAD data structure');
        }
        
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError, 'Content:', content);
        toast.error("AI returned invalid data format. Creating fallback model.");
        
        // Create a more interesting fallback based on the prompt
        const promptWords = (request.prompt || '').toLowerCase();
        let fallbackShapes = [];
        
        if (promptWords.includes('house') || promptWords.includes('building')) {
          fallbackShapes = [
            { type: 'cube', position: {x: 0, y: 1, z: 0}, scale: {x: 4, y: 2, z: 3}, rotation: {x: 0, y: 0, z: 0} },
            { type: 'cube', position: {x: 0, y: 3.5, z: 0}, scale: {x: 4.5, y: 1, z: 3.5}, rotation: {x: 0, y: 0, z: 0} }
          ];
        } else {
          fallbackShapes = [
            { type: 'cube', position: {x: 0, y: 0.5, z: 0}, scale: {x: 1, y: 1, z: 1}, rotation: {x: 0, y: 0, z: 0} }
          ];
        }
        
        cadData = {
          description: "Fallback model - AI response was invalid",
          coordinates: [],
          shapes: fallbackShapes
        };
      }

      const result = {
        id: crypto.randomUUID(),
        ...cadData,
        metadata: {
          prompt: request.prompt || "Image analysis",
          timestamp: new Date().toISOString(),
          model: 'gpt-4o'
        }
      };

      console.log('Generated CAD result:', result);
      return result;
      
    } catch (error) {
      console.error('Image-to-CAD generation error:', error);
      toast.error(`Failed to generate CAD from image: ${error.message}`);
      throw error;
    }
  }

  private async imageUrlToBase64(url: string): Promise<string> {
    try {
      console.log('Converting image to base64:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          console.log('Image converted to base64, length:', base64.length);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
