
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { Wand2 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleDemoLogin = () => {
    toast({
      title: "Demo Mode Activated",
      description: "You're now using Sci-Icons in demo mode. Enjoy!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/9a3cd3bf-f8a7-4414-b9c5-3e4b3017882d.png" 
              alt="Sci-Icons Logo" 
              className="h-10 w-10 mr-2" 
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Sci-Icons
            </span>
          </div>
          {!showAuth && (
            <Button onClick={handleGetStarted}>Get Started</Button>
          )}
        </header>

        <main className="flex-1 container mx-auto px-4 py-12">
          {showAuth ? (
            <div className="max-w-md mx-auto">
              <AuthForm onDemoLogin={handleDemoLogin} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Generate Scientific Icons with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  AI
                </span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Create beautiful, accurate scientific illustrations in seconds with our specialized AI model.
                Ideal for researchers, educators, and science communicators.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleGetStarted} size="lg" className="shadow-lg">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/")}
                >
                  Try Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold mb-2">2D BioRender Style</h3>
                  <p className="text-muted-foreground">
                    Create flat, clean scientific illustrations perfect for publications and presentations.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold mb-2">3D BioRender Style</h3>
                  <p className="text-muted-foreground">
                    Generate detailed three-dimensional models of molecules, cells, and anatomical structures.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold mb-2">Transparent Backgrounds</h3>
                  <p className="text-muted-foreground">
                    Easily create icons with transparent backgrounds for seamless integration into your work.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Sci-Icons. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
