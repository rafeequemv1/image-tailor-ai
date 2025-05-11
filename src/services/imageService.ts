
interface GenerateImageRequest {
  apiKey: string;
  images: File[];
  prompt: string;
  makeTransparent?: boolean;
  preset?: string;
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
  preset = "",
}: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    if (!apiKey) {
      return {
        success: false,
        error: "No API key provided",
      };
    }

    // Apply preset styles if selected
    let finalPrompt = prompt;
    
    if (preset === "2D biorender") {
      finalPrompt = `${prompt}, in 2D biorender style, scientific illustration, clean vector graphics, cellular detail, molecular visualization, educational diagram style, high contrast`;
    } else if (preset === "3D biorender") {
      finalPrompt = `${prompt}, in 3D biorender style, volumetric rendering, depth, scientific visualization, detailed molecular structures, protein visualization, medical illustration quality, high detail`;
    }
    
    // If transparency is requested, add it to the prompt
    if (makeTransparent) {
      finalPrompt = `${finalPrompt} with transparent background`;
    }

    // For text-to-image generation (no uploaded images)
    if (images.length === 0) {
      const requestBody = {
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024"
      };

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
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
    // For image edits (with uploaded images)
    else {
      // For image edits, we need to use FormData
      const formData = new FormData();
      formData.append("model", "gpt-image-1");
      formData.append("prompt", finalPrompt);
      formData.append("n", "1");
      formData.append("size", "1024x1024");
      
      // Append each image
      images.forEach((image, index) => {
        if (index === 0) {
          formData.append("image", image);
        } else {
          formData.append("mask", image);
        }
      });

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`
          // Note: Do not set Content-Type for FormData requests
          // Browser will automatically set it with the correct boundary
        },
        body: formData
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
