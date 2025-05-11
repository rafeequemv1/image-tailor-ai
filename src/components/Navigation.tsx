
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  return (
    <header className="w-full py-4 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Image Generator
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/app">Start Generating</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
