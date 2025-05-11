
interface GenerateImageRequest {
  apiKey: string;
  images: File[];
  prompt: string;
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
}: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    if (!apiKey) {
      return {
        success: false,
        error: "No API key provided",
      };
    }

    if (images.length === 0) {
      return {
        success: false,
        error: "No images provided",
      };
    }

    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    
    // Append each image
    images.forEach(image => {
      formData.append("image[]", image);
    });
    
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");

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
