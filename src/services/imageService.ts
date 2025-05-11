
interface ImageGenerationParams {
  prompt: string;
  makeTransparent?: boolean;
  images?: File[];
  maskImage?: File | null;
  quality?: string;
  size?: string;
}

interface ImageGenerationResponse {
  success: boolean;
  data?: {
    url?: string;
    b64_json?: string;
  };
  error?: string;
}

// Hardcoded API key
const API_KEY = "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";

export const generateImage = async ({
  prompt,
  makeTransparent = false,
  images = [],
  maskImage = null,
  quality = "high",
  size = "square"
}: ImageGenerationParams): Promise<ImageGenerationResponse> => {
  try {
    // Process prompt to add transparency request if needed
    const finalPrompt = makeTransparent
      ? `${prompt}. Please ensure the background is completely transparent.`
      : prompt;

    // Configure size based on selection
    let width = 1024;
    let height = 1024;
    
    if (size === "portrait") {
      width = 1024;
      height = 1792;
    } else if (size === "landscape") {
      width = 1792;
      height = 1024;
    }
    
    // Prepare API request
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    // Basic image generation request
    const requestBody: any = {
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size: `${width}x${height}`,
      quality: quality
    };

    // Add response format for transparent images
    if (makeTransparent) {
      requestBody.response_format = "b64_json";
    }
    
    // DALL-E API endpoint
    const endpoint = "https://api.openai.com/v1/images/generations";

    // Make the API request
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data[0],
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
