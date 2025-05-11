
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center bg-gradient-to-b from-background to-blue-50/30">
        <div className="max-w-3xl mx-auto">
          <img 
            src="/sci-icons-logo.png" 
            alt="Sci-Icons Logo" 
            className="w-32 h-32 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-6">
            Scientific Icon Generator
          </h1>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, professional scientific icons for your research papers, 
            presentations, and educational materials using AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="px-8">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="px-8">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">AI-Generated Icons</h3>
              <p className="text-muted-foreground">
                Generate detailed scientific icons with a simple text prompt using the latest AI models
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Customizable Options</h3>
              <p className="text-muted-foreground">
                Edit generated icons with transparent backgrounds and various style options
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Export & Share</h3>
              <p className="text-muted-foreground">
                Easily download in various formats or share your created icons directly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sci-Icons. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
