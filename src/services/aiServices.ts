
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
              content: `You are a CAD generation assistant. Convert text descriptions into 3D CAD model data. 
              Return a JSON object with: description, coordinates array, shapes array with type/position/scale/rotation, and metadata.
              Shapes can be: cube, sphere, cylinder, plane. Coordinates should be in metric units.
              Make the design practical and architecturally sound.`
            },
            {
              role: 'user',
              content: `Generate a 3D CAD model for: ${request.prompt}. Style: ${request.style || 'modern'}. Complexity: ${request.complexity || 'medium'}.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      let cadData;
      try {
        cadData = JSON.parse(content);
      } catch {
        // If JSON parsing fails, create a simple structure
        cadData = {
          description: request.prompt,
          coordinates: [],
          shapes: [
            {
              type: 'cube',
              position: {x: 0, y: 0, z: 0},
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
    const apiKey = this.getAnthropicKey();
    if (!apiKey) {
      toast.error("Anthropic API key not found. Please add it in Settings.");
      throw new Error("Anthropic API key required");
    }

    try {
      // Convert image to base64 if needed
      const imageBase64 = await this.imageUrlToBase64(request.imageUrl);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image and convert it into 3D CAD model data. 
                  ${request.prompt ? `Additional context: ${request.prompt}` : ''}
                  
                  Return a JSON object with: description, coordinates array, shapes array with type/position/scale/rotation, and metadata.
                  Shapes can be: cube, sphere, cylinder, plane. Coordinates should be in metric units.
                  Focus on the main architectural or structural elements visible in the image.`
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      // Parse the JSON response
      let cadData;
      try {
        cadData = JSON.parse(content);
      } catch {
        // If JSON parsing fails, create a simple structure
        cadData = {
          description: "Generated from uploaded image",
          coordinates: [],
          shapes: [
            {
              type: 'cube',
              position: {x: 0, y: 0, z: 0},
              scale: {x: 1, y: 1, z: 1}
            }
          ]
        };
      }

      return {
        id: crypto.randomUUID(),
        ...cadData,
        metadata: {
          prompt: request.prompt || "Image analysis",
          timestamp: new Date().toISOString(),
          model: 'claude-sonnet-4-20250514'
        }
      };
    } catch (error) {
      console.error('Image-to-CAD generation error:', error);
      toast.error("Failed to generate CAD from image");
      throw error;
    }
  }

  private async imageUrlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
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
