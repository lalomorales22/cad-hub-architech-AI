
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
        throw new Error(`Fal.AI API error: ${response.status}`);
      }

      return await response.json();
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
        throw new Error(`Fal.AI API error: ${response.status}`);
      }

      return await response.json();
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
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          width: options?.width || 1024,
          height: options?.height || 1024,
          steps: options?.steps || 30,
          style_preset: options?.style || 'architectural'
        })
      });

      if (!response.ok) {
        throw new Error(`Stability AI API error: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch('https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
          width: 2048,
          height: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`Stability AI API error: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "685265c04b63e0f05b34e1e12ddc2e59b9c6de5b6fe2c23d41d3e6b21e2df78a",
          input: {
            prompt: prompt,
            guidance_scale: 15,
            num_inference_steps: 64
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Replicate error:', error);
      toast.error("Failed to generate with Replicate");
      throw error;
    }
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
          version: "point-cloud-processing-model-id",
          input: {
            point_cloud: pointCloudData,
            processing_type: "mesh_reconstruction"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Replicate point cloud error:', error);
      toast.error("Failed to process point cloud");
      throw error;
    }
  }
}

// DeepMind Service (AlphaFold for structural analysis)
export class DeepMindService {
  private getAPIKey(): string | null {
    return localStorage.getItem('deepmind_api_key');
  }

  async analyzeProteinStructure(sequence: string): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("DeepMind API key not found. Please add it in Settings.");
      throw new Error("DeepMind API key required");
    }

    try {
      const response = await fetch('https://api.deepmind.com/v1/alphafold/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequence: sequence,
          confidence_threshold: 70
        })
      });

      if (!response.ok) {
        throw new Error(`DeepMind API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DeepMind error:', error);
      toast.error("Failed to analyze protein structure");
      throw error;
    }
  }

  async analyzeStructuralStability(structureData: any): Promise<any> {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      toast.error("DeepMind API key not found. Please add it in Settings.");
      throw new Error("DeepMind API key required");
    }

    try {
      const response = await fetch('https://api.deepmind.com/v1/structure/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structure: structureData,
          analysis_type: 'stability'
        })
      });

      if (!response.ok) {
        throw new Error(`DeepMind API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DeepMind stability analysis error:', error);
      toast.error("Failed to analyze structural stability");
      throw error;
    }
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
