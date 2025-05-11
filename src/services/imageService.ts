
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

    const formData = new FormData();
    
    // If transparency is requested, add it to the prompt
    const finalPrompt = makeTransparent 
      ? `${prompt} with transparent background` 
      : prompt;
    
    // Determine which endpoint to use based on whether images were provided
    let endpoint = "https://api.openai.com/v1/images/generations"; // Default for text-to-image
    
    if (images.length > 0) {
      // Switch to image edit endpoint when images are provided
      endpoint = "https://api.openai.com/v1/images/edits";
      formData.append("model", "gpt-image-1");
      
      // Append each image
      images.forEach(image => {
        formData.append("image[]", image);
      });
    } else {
      // For text-to-image generation
      formData.append("model", "dall-e-3");
    }
    
    formData.append("prompt", finalPrompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
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
