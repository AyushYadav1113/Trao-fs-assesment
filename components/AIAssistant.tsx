"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Vapi from "@vapi-ai/web";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      console.error("Missing VAPI API Key");
      return;
    }

    const vapi = new Vapi(apiKey);

    vapi.on("call-start", () => setIsConnected(true));
    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapiRef.current = vapi;
    return () => vapi.stop();
  }, []);

  const startCall = async () => {
    try {
      const assistantId =
        process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      if (!assistantId) return console.error("Missing Assitant ID");
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error("VAPI Start Error:", err);
    }
  };

  const stopCall = async () => {
    try {
      await vapiRef.current.stop();
    } catch (err) {
      console.error("VAPI Stop Error:", err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex justify-between items-center">
              <h3 className="text-white text-sm font-semibold">
                Voice Assistant
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Visual Feedback */}
            <div className="flex-1 flex items-center justify-center">
              {!isConnected && (
                <div className="text-white/40 text-sm text-center">
                  Ready to talk
                </div>
              )}

              {isConnected && !isSpeaking && (
                <div className="text-white/40 text-sm text-center">
                  Listening...
                </div>
              )}

              {isConnected && isSpeaking && (
                <img
                  src="/speaking-animation.gif"
                  alt="Speaking Animation"
                  className="w-48 h-48 object-contain"
                />
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-white/10 flex justify-center">
              {!isConnected ? (
                <button
                  onClick={startCall}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
                >
                  Start Talking 🎤
                </button>
              ) : (
                <button
                  onClick={stopCall}
                  className="px-6 py-3 bg-red-600 text-white rounded-full"
                >
                  End Conversation ✕
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full text-white shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? "✕" : "AI"}
      </motion.button>
    </>
  );
}