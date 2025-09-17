export interface GeminiResponse {
  imageUrls: string[];
  text: string | null;
}

export interface PricingSuggestion {
  aiSuggested: number;
  minAcceptable: number;
  reasoning: string;
}

export interface ProductListing {
  title: string;
  attributes: {
    material: string;
    dimensions: string;
    timeToMakeHrs: number;
    style: string;
  };
  care: string[];
  description: string;
  seoBullets: string[];
  story: string;
  pricing?: PricingSuggestion;
  originalImagePreview?: string | null;
  generatedImage?: GeminiResponse | null;
}

export type PhotoshootMode = 'lifestyle' | 'background_replace' | 'cleanup' | 'colorway' | 'scene_lighting' | 'pose_adjust';

export type ImageQuality = 'fast' | 'high';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}