
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Beaker, Flask, Microscope } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Scientific Icons Made Simple
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate high-quality scientific icons and illustrations for research papers, 
              presentations, and educational materials with our AI-powered tool.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/app">Start Creating Icons</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Scientific Visualization Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Flask className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Scientific Concepts</h3>
                <p className="text-muted-foreground">
                  Create clear, accurate icons representing molecules, lab equipment, and scientific concepts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Beaker className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Image Transformation</h3>
                <p className="text-muted-foreground">
                  Upload existing scientific images and enhance or modify them to suit your specific needs.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Microscope className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multiple Styles</h3>
                <p className="text-muted-foreground">
                  Choose from various scientific visualization styles for academic papers or presentations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Scientific Icons?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join researchers and educators who are already creating stunning scientific visualizations with our AI tool.
            </p>
            <Button size="lg" asChild>
              <Link to="/app">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
