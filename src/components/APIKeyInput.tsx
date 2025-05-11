
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";

interface APIKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ apiKey, setApiKey }) => {
  const { toast } = useToast();
  const [tempKey, setTempKey] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = () => {
    if (tempKey.trim() === "") {
      toast({
        title: "Error",
        description: "API Key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setApiKey(tempKey);
    localStorage.setItem("openai_api_key", tempKey);
    toast({
      title: "Success",
      description: "API Key saved successfully",
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </div>
      ),
    });
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="api-key"
        className="block text-sm font-medium text-foreground"
      >
        OpenAI API Key
      </label>
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="sk-..."
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showKey ? (
              <X className="h-4 w-4" />
            ) : (
              <span className="text-xs">SHOW</span>
            )}
          </button>
        </div>
        <Button onClick={handleSaveKey}>Save</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally on your browser and never sent to our
        servers.
      </p>
    </div>
  );
};

export default APIKeyInput;
