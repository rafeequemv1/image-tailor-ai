
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Beaker, Microscope, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-white to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                  Scientific Icons
                  <span className="block mt-2">Made Simple</span>
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                  Generate high-quality scientific icons and illustrations for research papers, 
                  presentations, and educational materials with our AI-powered tool.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-200 hover:text-black border-0" asChild>
                  <Link to="/app" className="group flex items-center">
                    Start Creating Icons
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Scientific Visualization Tools</h2>
              <div className="h-1 w-20 bg-black mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 border border-gray-200 hover:border-black transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-4">
                  <Beaker className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Scientific Concepts</h3>
                <p className="text-gray-600">
                  Create clear, accurate icons representing molecules, lab equipment, and scientific concepts.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 border border-gray-200 hover:border-black transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-4">
                  <Beaker className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Image Transformation</h3>
                <p className="text-gray-600">
                  Upload existing scientific images and enhance or modify them to suit your specific needs.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 border border-gray-200 hover:border-black transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-4">
                  <Microscope className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multiple Styles</h3>
                <p className="text-gray-600">
                  Choose from various scientific visualization styles for academic papers or presentations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Example Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Example Scientific Icons</h2>
              <div className="h-1 w-20 bg-black mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
                "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
                "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80",
                "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
                "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80",
                "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="overflow-hidden group"
                >
                  <div 
                    className="h-64 w-full bg-cover bg-center transition-transform duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    style={{ backgroundImage: `url(${src})` }}
                  >
                    <div className="h-full w-full bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <div className="h-1 w-20 bg-black mx-auto"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-1 border border-gray-200 p-8"
              >
                <div className="text-4xl font-bold mb-4">01</div>
                <h3 className="text-xl font-bold mb-2">Describe Your Icon</h3>
                <p className="text-gray-600">
                  Write a detailed description of the scientific icon you need or upload a reference image.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex-1 border border-gray-200 p-8"
              >
                <div className="text-4xl font-bold mb-4">02</div>
                <h3 className="text-xl font-bold mb-2">Generate</h3>
                <p className="text-gray-600">
                  Our AI processes your input and generates a high-quality scientific icon.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex-1 border border-gray-200 p-8"
              >
                <div className="text-4xl font-bold mb-4">03</div>
                <h3 className="text-xl font-bold mb-2">Download & Use</h3>
                <p className="text-gray-600">
                  Download your scientific icon for immediate use in papers, presentations, or materials.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Create Scientific Icons?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Join researchers and educators who are already creating stunning scientific visualizations with our AI tool.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 hover:text-black" asChild>
                <Link to="/app">Get Started Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
