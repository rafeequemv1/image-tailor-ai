
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { LogIn, ChevronRight, Beaker, Microscope, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-90" />
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Scientific Icons 
                  <span className="block mt-2 text-gray-300">Made Simple</span>
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                  Generate high-quality scientific icons and illustrations for research papers, 
                  presentations, and educational materials with our AI-powered tool.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-200"
                    asChild
                  >
                    <Link to="/app" className="flex items-center">
                      Get Started 
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black"
                    asChild
                  >
                    <Link to="/login" className="flex items-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Log In
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden md:block"
              >
                <div className="relative">
                  <div className="w-full h-[400px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Beaker className="w-24 h-24 text-white opacity-50" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <div className="h-1 w-20 bg-black mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create professional scientific illustrations with an intuitive toolset
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Beaker className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Scientific Iconography</h3>
                <p className="text-gray-600">
                  Access a comprehensive library of scientific icons and symbols for chemistry, 
                  biology, physics, and more.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Microscope className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Custom Illustrations</h3>
                <p className="text-gray-600">
                  Generate custom scientific illustrations with our AI-powered tools,
                  perfectly tailored to your research needs.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Users className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Collaboration</h3>
                <p className="text-gray-600">
                  Share and collaborate on scientific illustrations with your team,
                  making research visualization a seamless process.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Image Showcase Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Gallery</h2>
              <div className="h-1 w-20 bg-black mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore examples of scientific illustrations created with our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-20 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Beaker className="w-16 h-16 text-white opacity-40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Create?</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Join scientists and educators who are already using our platform to create
                impactful scientific illustrations.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
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
