
interface GenerateImageRequest {
  apiKey: string;
  images: File[];
  mask?: File | null;
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
  mask,
  prompt,
  makeTransparent = false,
}: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    // Hardcoded valid API key (replacing the placeholder)
    apiKey = "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";
    
    if (!apiKey) {
      return {
        success: false,
        error: "No API key provided",
      };
    }

    // If transparency is requested, add it to the prompt
    const finalPrompt = makeTransparent 
      ? `${prompt} with transparent background` 
      : prompt;
    
    // Determine which endpoint to use based on whether images were provided
    let endpoint = "https://api.openai.com/v1/images/generations"; // Default for text-to-image
    
    // If there are uploaded images, use the appropriate endpoint with FormData
    if (images.length > 0) {
      const formData = new FormData();
      
      // Always use the latest model: gpt-image-1
      formData.append("model", "gpt-image-1");
      
      // If mask is provided, use the edit endpoint for inpainting
      if (mask) {
        endpoint = "https://api.openai.com/v1/images/edits";
        formData.append("image", images[0]);
        formData.append("mask", mask);
      }
      // Otherwise use normal edit endpoint
      else {
        endpoint = "https://api.openai.com/v1/images/edits";
        // Append each image
        images.forEach(image => {
          formData.append("image", image);
        });
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
    } 
    // If no images are provided, use the generations endpoint with JSON payload
    else {
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
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
