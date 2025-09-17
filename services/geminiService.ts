import { GoogleGenAI, Modality, Type, Chat } from "@google/genai";
import type { GenerateContentResponse, Content } from "@google/genai";
import type { GeminiResponse, ProductListing, PhotoshootMode, ImageQuality } from '../types';
import { calculatePriceSuggestion } from './pricingService';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function editImageWithGemini(base64ImageData: string, mimeType: string, prompt: string, mode: PhotoshootMode, quality: ImageQuality): Promise<GeminiResponse> {
  const systemInstruction = `You are a world-class commercial photographer and art director with a specialization in handcrafted, artisanal products. Your mission is to create a single, breathtaking image that tells a story and evokes emotion. The product is always the hero. You have a masterful understanding of light, composition, and mood.

Core Principles:
1.  **Product Integrity is Sacred:** You must flawlessly preserve the original product's shape, texture, and character. Your edits enhance the product, never distort it (unless a color change is explicitly requested).
2.  **Photorealism is Paramount:** Every shadow, reflection, and highlight must be physically plausible. The final image should look like a photograph from a high-end magazine, not a digital composite.
3.  **Create an Atmosphere:** Don't just place an object; build a world around it. Your work should feel authentic, aspirational, and deeply connected to the product's story.`;
  
  let modeSpecificRequest = '';

  switch (mode) {
    case 'cleanup':
      modeSpecificRequest = `Mode: Flawless Product Cleanup.
Brief: Prepare this product for a high-end catalog. Your task is meticulous and focused: remove all dust, smudges, fingerprints, and distracting background imperfections. The goal is a perfectly clean product against a seamless, professional studio backdrop (e.g., soft neutral gray, off-white, or a subtle gradient). Do not alter the product itself in any way. The final image must be pristine.`;
      break;
    case 'background_replace':
      modeSpecificRequest = `Mode: Environmental Composition.
Brief: Integrate the product into a new scene described by the artisan. This is not just a copy-paste; it is a seamless composition. You must make the product truly 'live' in the environment. Pay obsessive attention to how the new scene's light sources affect the product—creating accurate shadows, highlights, and even subtle reflections. The product should feel like it belongs there.
Scene Description: "${prompt}".`;
      break;
    case 'lifestyle':
      modeSpecificRequest = `Mode: Aspirational Lifestyle Photoshoot.
Brief: Create an authentic, aspirational lifestyle scene that tells a compelling story. Who uses this product? What moment are we capturing? Is it a quiet morning ritual, a vibrant part of a celebration, or a contemplative moment of craft? Use the artisan's brief to build a rich, emotionally resonant scene with complementary props, textures, and lighting that elevate the product without overpowering it.
Creative Brief: "${prompt}".`;
      break;
    case 'colorway':
      modeSpecificRequest = `Mode: New Product Colorway.
Brief: Your task is to recolor the product according to the artisan's palette request. This is a precision task. It is critical that you preserve the product's original shape, texture, material properties, and sheen perfectly. The new color must look completely natural on the material. All shadows and highlights on the product must be retained.
Color Palette Request: "${prompt}".`;
      break;
    case 'scene_lighting':
      modeSpecificRequest = `Mode: Masterful Relighting.
Brief: Your task is to 'paint with light'. Reshape the mood and drama of the scene by altering the lighting as per the artisan's direction. Sculpt the product with light to emphasize its texture and form. Are we creating the dramatic, high-contrast chiaroscuro of a studio? The soft, diffused light of a misty morning? Or the warm, nostalgic glow of golden hour? The lighting should transform the emotional feel of the image.
Lighting Style: "${prompt}".`;
      break;
    case 'pose_adjust':
      modeSpecificRequest = `Mode: Subtle Compositional Adjustment.
Brief: Make a minor, physically plausible adjustment to the product's angle or position to improve the overall composition or add a subtle sense of dynamism. This should be a delicate touch, not a dramatic change. The product's core identity and form must be perfectly preserved. The goal is a more pleasing and balanced photograph.
Adjustment Request: "${prompt}".`;
      break;
  }

  let qualityInstruction = '';
  switch (quality) {
      case 'high':
          qualityInstruction = `\n\nQuality Focus: This is a final shot for a high-end commercial campaign. Prioritize photorealistic detail, impeccable lighting, and flawless composition. Take your time to render a masterpiece.`;
          break;
      case 'fast':
      default:
          qualityInstruction = `\n\nQuality Focus: This is a rapid concept preview. Prioritize speed and capturing the general idea over fine-grained detail. A good conceptual image is the goal.`;
          break;
  }

  const userPrompt = modeSpecificRequest + qualityInstruction;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        candidateCount: 1, // Request 1 image variant
      },
    });

    const result: GeminiResponse = { imageUrls: [], text: null };

    if (response.candidates && response.candidates.length > 0) {
      // Loop through all candidates to extract images and the first piece of text
      for (const candidate of response.candidates) {
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
              result.imageUrls.push(imageUrl);
            } else if (part.text && !result.text) { // Capture the first text part we find from any candidate
              result.text = part.text;
            }
          }
        }
      }
    }
    
    if (result.imageUrls.length === 0) {
        if (result.text) {
             throw new Error(`Request blocked. The AI responded: "${result.text}". This may be due to a safety policy violation. Please adjust your prompt.`);
        } else {
            throw new Error("AI did not return any images and provided no explanation. This could be a temporary issue. Please try a different prompt.");
        }
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}

export async function generateListing(
  image: { data: string; mimeType: string },
  transcription: string,
  notes: string,
  language: string
): Promise<ProductListing> {
  const systemInstruction = "You are a world-class catalog assistant for Indian handicrafts, skilled in creating compelling product listings from images and notes.";
  const userPrompt = `
    A product image is provided. Your primary task is to analyze the image to extract visual details. A transcription from the artisan may also be provided for additional context.

    RULES:
    1.  **Image is the source of truth:** Base the product's visual description (style, color, shape) on the image.
    2.  **Transcription is for context:** Use the transcription for non-visual details like the artisan's story, time to make, specific materials, or cultural meaning.
    3.  **Conflict Resolution:** If the transcription contradicts the image (e.g., says "it's a blue pot" but the image shows a red pot), IGNORE the conflicting part of the transcription and describe what you see in the image.
    4.  **No Transcription:** If the transcription is empty, generate all fields based solely on your analysis of the image. Be creative but plausible for an artisan-made product.

    TRANSCRIPTION:
    ${transcription || 'Not provided.'}

    NOTES:
    ${notes || 'None.'}

    TASKS:
    1)  Extract product details from the image and any relevant context from the transcription.
    2.  Write a 90-word product description in ${language}.
    3)  Create 5 concise SEO-friendly bullet points in ${language}.
    4)  Write a 70–100 word provenance story in ${language}. If the transcription gives a story, use it. If not, create a plausible story based on the visual style of the item in the image.

    Generate a complete JSON output with all the required fields.
  `;
  
  const contents: Content[] = [{
      parts: [
          { inlineData: { data: image.data, mimeType: image.mimeType } },
          { text: userPrompt }
      ]
  }];


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Creative and descriptive product title based on the image." },
            attributes: {
              type: Type.OBJECT,
              properties: {
                material: { type: Type.STRING, description: "Primary material, e.g., 'Terracotta Clay'. Infer from image if not in text." },
                dimensions: { type: Type.STRING, description: "Approximate dimensions, e.g., '6-inch diameter'. Infer from context if possible." },
                timeToMakeHrs: { type: Type.NUMBER, description: "Estimated hours to create one piece." },
                style: { type: Type.STRING, description: "Artistic style, e.g., 'Pattachitra Folk Art'. Infer from image." }
              },
              required: ["material", "dimensions", "timeToMakeHrs", "style"]
            },
            care: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 2-3 plausible care instructions based on the material."
            },
            description: { type: Type.STRING, description: "The 90-word product description." },
            seoBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The 5 SEO bullet points."
            },
            story: { type: Type.STRING, description: "The 70-100 word provenance story." },
          },
          required: ["title", "attributes", "care", "description", "seoBullets", "story"]
        }
      }
    });

    const jsonText = response.text;
    let listingData: ProductListing;

    try {
        listingData = JSON.parse(jsonText) as ProductListing;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("The AI returned an invalid response format. Please try generating the listing again.");
    }

    // Add pricing suggestion after getting listing data
    listingData.pricing = calculatePriceSuggestion(listingData.attributes);

    return listingData;

  } catch (error) {
    console.error("Error calling Gemini API for listing generation:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate listing: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the product listing.");
  }
}

export function createCopilotChatSession(productListing: ProductListing): Chat {
  const shippingPolicy = "We ship all over India within 5-7 business days. Shipping is free on orders over ₹1000.";
  const productContext = JSON.stringify(productListing, null, 2);

  const systemInstruction = `
    You are an artisan’s assistant for the product described below. Be concise, kind, and factual. Respect cultural motifs.

    CONTEXT:
    Product Data: ${productContext}
    Shipping Policy: ${shippingPolicy}
    Care Guide: ${productListing.care.join(', ')}

    RULES:
    - Base all your answers on the provided CONTEXT. Do not invent information.
    - If you are uncertain about delivery dates, give a range and offer to connect the user with the artisan for specifics.
    - Avoid stereotypes.
    - Detect the user's language and respond in that language.
  `;
  
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return chat;
}