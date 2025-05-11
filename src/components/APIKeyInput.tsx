import React from "react";

// This component is no longer needed as we're using a hardcoded API key,
// but keeping the file to avoid breaking any existing references.
const APIKeyInput: React.FC<{ apiKey?: string; setApiKey?: (key: string) => void }> = () => {
  return null; // Component no longer rendered
};

export default APIKeyInput;
