
import React from "react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-10">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-75 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      ></motion.div>
      <div className="relative p-6 bg-background rounded-lg flex flex-col items-center justify-center">
        <motion.div
          className="w-24 h-24 mb-6"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-full h-full relative">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-blue-600 border-opacity-30"></div>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-opacity-50"></div>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="w-64 h-64 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  );
}
