
import React from "react";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Image Generator. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={18} />
          </a>
          <a 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
