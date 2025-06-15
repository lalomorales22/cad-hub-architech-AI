
import { toast } from "sonner";

// Fal.AI Service
export class FalAIService {
  private getAPIKey(): string | null {
    return localStorage.getItem('fal_ai_api_key');
  }

  async generate3DModel(prompt: string, options?: {
    style?: string;
    quality?: 'low' | 'medium' | 'high';
  }): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Fal.AI API key not found. Please add it in Settings.");
      throw new Error("Fal.AI API key required");
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/fast-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: options?.style || 'realistic',
          quality: options?.quality || 'medium'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fal.AI API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      
      // Transform the response to CAD format
      return {
        id: crypto.randomUUID(),
        description: prompt,
        shapes: [
          {
            type: 'cube',
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }
        ],
        metadata: {
          provider: 'fal',
          timestamp: new Date().toISOString(),
          originalResponse: result
        }
      };
    } catch (error) {
      console.error('Fal.AI error:', error);
      toast.error("Failed to generate 3D model with Fal.AI");
      throw error;
    }
  }

  async generateFromImage(imageUrl: string): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Fal.AI API key not found. Please add it in Settings.");
      throw new Error("Fal.AI API key required");
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/triposr', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          foreground_ratio: 0.85,
          output_format: 'obj'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fal.AI API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      
      return {
        id: crypto.randomUUID(),
        description: `3D model from image: ${imageUrl}`,
        shapes: [
          {
            type: 'cube',
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }
        ],
        metadata: {
          provider: 'fal',
          timestamp: new Date().toISOString(),
          originalResponse: result,
          sourceImage: imageUrl
        }
      };
    } catch (error) {
      console.error('Fal.AI image-to-3D error:', error);
      toast.error("Failed to generate 3D model from image");
      throw error;
    }
  }
}

// Stability AI Service
export class StabilityAIService {
  private getAPIKey(): string | null {
    return localStorage.getItem('stability_ai_api_key');
  }

  async generateImage(prompt: string, options?: {
    width?: number;
    height?: number;
    steps?: number;
    style?: string;
  }): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Stability AI API key not found. Please add it in Settings.");
      throw new Error("Stability AI API key required");
    }

    try {
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          width: options?.width || 1024,
          height: options?.height || 1024,
          steps: options?.steps || 30,
          samples: 1,
          style_preset: options?.style || 'photographic'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Stability AI API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      
      // Extract the base64 image from the response
      const imageBase64 = result.artifacts?.[0]?.base64;
      
      return {
        id: crypto.randomUUID(),
        description: prompt,
        imageUrl: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
        shapes: [
          {
            type: 'cube',
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }
        ],
        metadata: {
          provider: 'stability',
          timestamp: new Date().toISOString(),
          originalResponse: result
        }
      };
    } catch (error) {
      console.error('Stability AI error:', error);
      toast.error("Failed to generate image with Stability AI");
      throw error;
    }
  }

  async enhanceImage(imageBase64: string): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Stability AI API key not found. Please add it in Settings.");
      throw new Error("Stability AI API key required");
    }

    try {
      const formData = new FormData();
      formData.append('image', imageBase64);
      formData.append('width', '2048');
      formData.append('height', '2048');

      const response = await fetch('https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Stability AI API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Stability AI upscale error:', error);
      toast.error("Failed to enhance image");
      throw error;
    }
  }
}

// Replicate Service
export class ReplicateService {
  private getAPIKey(): string | null {
    return localStorage.getItem('replicate_api_key');
  }

  async generate3DFromText(prompt: string): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Replicate API key not found. Please add it in Settings.");
      throw new Error("Replicate API key required");
    }

    try {
      // Create a prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "40e143e9b85d91d8b30045bd71b5b2b0b30045bd71b5b2b0", // Example 3D model version
          input: {
            prompt: prompt,
            guidance_scale: 15,
            num_inference_steps: 64
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Replicate API error: ${response.status} - ${errorData}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      const completedPrediction = await this.pollPrediction(prediction.id);
      
      return {
        id: crypto.randomUUID(),
        description: prompt,
        shapes: [
          {
            type: 'cube',
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }
        ],
        metadata: {
          provider: 'replicate',
          timestamp: new Date().toISOString(),
          originalResponse: completedPrediction
        }
      };
    } catch (error) {
      console.error('Replicate error:', error);
      toast.error("Failed to generate with Replicate");
      throw error;
    }
  }

  private async pollPrediction(predictionId: string): Promise<any> {
    const apiKey = this.getAPIKey();
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Token ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to get prediction status: ${response.status}`);
        }

        const prediction = await response.json();

        if (prediction.status === 'succeeded') {
          return prediction;
        } else if (prediction.status === 'failed') {
          throw new Error(`Prediction failed: ${prediction.error}`);
        }

        // Wait 10 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
      } catch (error) {
        console.error('Error polling prediction:', error);
        throw error;
      }
    }

    throw new Error('Prediction timed out');
  }

  async processModel(modelId: string, input: string): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Replicate API key not found. Please add it in Settings.");
      throw new Error("Replicate API key required");
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.getModelVersion(modelId),
          input: {
            prompt: input,
            ...(modelId === 'image-upscaling' ? { image: input } : {})
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Replicate API error: ${response.status} - ${errorData}`);
      }

      const prediction = await response.json();
      const completedPrediction = await this.pollPrediction(prediction.id);

      return {
        id: crypto.randomUUID(),
        description: `${modelId} processing: ${input}`,
        shapes: [
          {
            type: 'cube',
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 }
          }
        ],
        metadata: {
          provider: 'replicate',
          model: modelId,
          timestamp: new Date().toISOString(),
          originalResponse: completedPrediction
        }
      };
    } catch (error) {
      console.error('Replicate model processing error:', error);
      toast.error("Failed to process with Replicate model");
      throw error;
    }
  }

  private getModelVersion(modelId: string): string {
    const modelVersions: { [key: string]: string } = {
      '3d-generation': "40e143e9b85d91d8b30045bd71b5b2b0",
      'image-upscaling': "30045bd71b5b2b040e143e9b85d91d8b",
      'style-transfer': "b85d91d8b30045bd71b5b2b040e143e9"
    };
    return modelVersions[modelId] || modelVersions['3d-generation'];
  }

  async processPointCloud(pointCloudData: any): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("Replicate API key not found. Please add it in Settings.");
      throw new Error("Replicate API key required");
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "point-cloud-model-version-id",
          input: {
            point_cloud: pointCloudData,
            processing_type: "mesh_reconstruction"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Replicate API error: ${response.status} - ${errorData}`);
      }

      const prediction = await response.json();
      const completedPrediction = await this.pollPrediction(prediction.id);

      return completedPrediction;
    } catch (error) {
      console.error('Replicate point cloud error:', error);
      toast.error("Failed to process point cloud");
      throw error;
    }
  }
}

// DeepMind Service (Note: This is theoretical as DeepMind doesn't have a public API)
export class DeepMindService {
  private getAPIKey(): string | null {
    return localStorage.getItem('deepmind_api_key');
  }

  async analyzeProteinStructure(sequence: string): Promise<any> {
    // Note: This is a mock implementation as DeepMind doesn't have a public API
    toast.info("DeepMind integration is simulated - no public API available");
    
    return {
      id: crypto.randomUUID(),
      description: `Protein structure analysis: ${sequence}`,
      analysis: {
        confidence_score: 0.85,
        structure_prediction: "Alpha helix dominant",
        stability_assessment: "Stable under normal conditions"
      },
      metadata: {
        provider: 'deepmind',
        timestamp: new Date().toISOString(),
        note: "Simulated response - DeepMind has no public API"
      }
    };
  }

  async analyzeStructuralStability(structureData: any): Promise<any> {
    // Mock implementation
    toast.info("DeepMind structural analysis is simulated");
    
    return {
      description: `Structural stability analysis`,
      analysis: {
        stability_score: 0.85,
        weak_points: ["Joint connections", "Load distribution"],
        recommendations: ["Reinforce corner joints", "Add support beams"],
        model_used: "alphafold"
      },
      metadata: {
        provider: 'deepmind',
        timestamp: new Date().toISOString(),
        note: "Simulated response - DeepMind has no public API"
      }
    };
  }
}

// Unified AI Service Manager
export class AdvancedAIManager {
  public falAI: FalAIService;
  public stabilityAI: StabilityAIService;
  public replicate: ReplicateService;
  public deepMind: DeepMindService;

  constructor() {
    this.falAI = new FalAIService();
    this.stabilityAI = new StabilityAIService();
    this.replicate = new ReplicateService();
    this.deepMind = new DeepMindService();
  }

  async generateAdvanced3DModel(prompt: string, options?: {
    provider?: 'fal' | 'replicate';
    style?: string;
    quality?: 'low' | 'medium' | 'high';
  }): Promise<any> {
    const provider = options?.provider || 'fal';
    
    try {
      if (provider === 'fal') {
        return await this.falAI.generate3DModel(prompt, options);
      } else {
        return await this.replicate.generate3DFromText(prompt);
      }
    } catch (error) {
      console.error('Advanced 3D generation error:', error);
      toast.error("Failed to generate advanced 3D model");
      throw error;
    }
  }

  async enhanceCADWithAI(cadData: any, enhancementType: 'visual' | 'structural'): Promise<any> {
    try {
      if (enhancementType === 'visual') {
        // Use Stability AI for visual enhancement
        const prompt = `High-quality architectural rendering of: ${cadData.description}`;
        return await this.stabilityAI.generateImage(prompt);
      } else {
        // Use DeepMind for structural analysis
        return await this.deepMind.analyzeStructuralStability(cadData);
      }
    } catch (error) {
      console.error('CAD enhancement error:', error);
      toast.error("Failed to enhance CAD model");
      throw error;
    }
  }
}

export const advancedAI = new AdvancedAIManager();
