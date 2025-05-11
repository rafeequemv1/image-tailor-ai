
interface GenerateImageRequest {
  apiKey: string;
  images: File[];
  prompt: string;
  makeTransparent?: boolean;
  style?: string;
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
  style = "none",
}: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    if (!apiKey) {
      return {
        success: false,
        error: "No API key provided",
      };
    }

    // If transparency is requested, add it to the prompt
    let finalPrompt = makeTransparent 
      ? `${prompt} with transparent background` 
      : prompt;
    
    // Apply style presets if selected
    if (style === "2d-biorender") {
      finalPrompt = `${finalPrompt} in 2D biorender style, scientific illustration, cell biology visualization`;
    } else if (style === "3d-biorender") {
      finalPrompt = `${finalPrompt} in 3D biorender style, detailed 3D scientific model, molecular visualization`;
    }
    
    // Determine whether to use text-to-image or image-to-image endpoint
    const hasImages = images.length > 0;
    
    if (hasImages) {
      // Image editing uses FormData
      const formData = new FormData();
      formData.append("model", "gpt-image-1");
      formData.append("prompt", finalPrompt);
      formData.append("n", "1");
      formData.append("size", "1024x1024");
      
      // Append the first image as the main image
      formData.append("image", images[0]);
      
      // If there are more images, append them as masks
      if (images.length > 1) {
        for (let i = 1; i < images.length; i++) {
          formData.append("mask", images[i]);
        }
      }

      const response = await fetch("https://api.openai.com/v1/images/edits", {
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
          error: data.error?.message || "Failed to edit image",
        };
      }

      return {
        success: true,
        data: data.data[0],
      };
    } else {
      // Text-to-image generation uses JSON
      const requestBody = {
        model: "gpt-image-1",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
      };

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
