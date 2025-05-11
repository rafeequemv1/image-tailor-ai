
interface GenerateImageRequest {
  apiKey: string;
  images: File[];
  prompt: string;
  makeTransparent?: boolean;
}

interface GenerateImageResponse {
  success: boolean;
  data?: {
    url: string;
    b64_json?: string;
  };
  error?: string;
}

export async function generateImage({
  apiKey,
  images,
  prompt,
  makeTransparent = false,
}: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    if (!apiKey) {
      return {
        success: false,
        error: "No API key provided",
      };
    }

    // Enhance the prompt for scientific icons
    let finalPrompt = prompt;
    if (!finalPrompt.toLowerCase().includes("icon")) {
      finalPrompt += ", minimalist icon";
    }

    // Add transparency request if needed
    if (makeTransparent) {
      finalPrompt += " with transparent background";
    }

    // We'll use the generations endpoint for text-to-image icons
    const endpoint = "https://api.openai.com/v1/images/generations";
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return {
        success: false,
        error: data.error?.message || "Failed to generate image",
      };
    }

    return {
      success: true,
      data: data.data[0],
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
