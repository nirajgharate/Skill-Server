import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Bot,
  Mic,
  Volume2,
  VolumeX,
} from "lucide-react";
import API from "../api/api";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "System Online. 👋 I am Jarvis, your Skill-Server AI Concierge. Describe your issue or specify a service, and I'll retrieve solutions and matching experts near you.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isTyping, isOpen]);

  // Setup Web Speech API Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = "en-US";
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        // Automatically send voice transcription
        setTimeout(() => handleSend(transcript), 600);
      };
      rec.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text-To-Speech Synthesizer
  const speak = (text) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // cancel current speech
    // Clean formatting tags
    const cleanText = text.replace(/[*_#`\-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Try to find a premium male/Jarvis voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Natural") ||
          v.name.includes("Male")
      ) || voices[0];

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.05;
    utterance.pitch = 0.95; // Slightly lower pitch for Jarvis feel

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when chat closes
  useEffect(() => {
    if (!isOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await API.post("/ai/chat", { message: text });
      
      if (response.data?.success) {
        const botReply = response.data.reply;
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        
        // Speak response
        setTimeout(() => speak(botReply), 200);
      } else {
        throw new Error(response.data?.message || "Invalid payload");
      }
    } catch (err) {
      console.error("AI Agent Jarvis request error:", err);
      const errorMsg = {
        id: Date.now() + 2,
        sender: "bot",
        text: "Offline connection detected. Systems are experiencing latency. Please try again shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      window.alert("Web Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      recognitionRef.current.start();
    }
  };

  const handleReset = async () => {
    try {
      setIsTyping(true);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      await API.post("/ai/reset");
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Sessions recalibrated. How can I assist you now, sir? Describe your plumbing, electrical, carpentry, or maintenance request.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error("Reset session error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const suggestionChips = [
    "Need electrical wiring fixed immediately",
    "Find a plumber to check basin leakage",
    "List nearby maintenance workers",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[520px] bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden text-cyan-400"
          >
            {/* Holographic Header */}
            <div className="p-5 bg-slate-900/80 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Jarvis Pulsing Orb */}
                <div className="relative w-10 h-10 rounded-full bg-cyan-950/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400 overflow-visible shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Bot size={20} strokeWidth={2.5} className="z-10 text-cyan-400" />
                  {(isSpeaking || isListening || isTyping) && (
                    <>
                      <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-75" />
                      <span className="absolute -inset-2 rounded-full border border-cyan-500/30 animate-pulse opacity-50" />
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 leading-none tracking-wide">
                    JARVIS <Sparkles size={12} className="text-cyan-400 animate-spin" />
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 mt-1 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-cyan-500 animate-pulse"}`} />
                    {isListening ? "Listening Voice..." : isSpeaking ? "Voice Feed Active" : "Core Systems Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice Mode Toggle */}
                <button
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setIsMuted(!isMuted);
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${isMuted ? "border-red-500/30 text-red-400 bg-red-950/20" : "border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40"}`}
                  title={isMuted ? "Unmute Voice responses" : "Mute Voice responses"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                {/* Reset Session */}
                <button
                  onClick={handleReset}
                  className="p-2 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40 rounded-xl transition-all cursor-pointer"
                  title="Recalibrate Session"
                >
                  <RefreshCw size={15} />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40 rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs font-semibold leading-relaxed transition-all shadow-md ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-slate-950 rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "bg-slate-900/90 text-cyan-300 rounded-tl-none border border-cyan-500/20"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        msg.sender === "user"
                          ? "text-slate-800"
                          : "text-cyan-500/60"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-4 bg-slate-900/90 border border-cyan-500/20 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="px-5 pb-3 bg-slate-950/40">
                <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/60 mb-2">Suggested Diagnostics</p>
                <div className="flex flex-col gap-2">
                  {suggestionChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip)}
                      className="w-full text-left px-3.5 py-2.5 bg-cyan-950/15 hover:bg-cyan-900/20 text-[10px] font-bold text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 rounded-xl transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Futuristic Input Bar */}
            <div className="p-4 bg-slate-900/90 border-t border-cyan-500/20 flex gap-2 items-center">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${isListening ? "border-red-500/50 text-red-400 bg-red-950/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40"}`}
                title="Speak to Jarvis"
              >
                <Mic size={15} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "Listening to your voice..." : "Ask Jarvis to diagnose or book..."}
                className="flex-1 px-4 py-3 bg-slate-950 border border-cyan-500/25 text-cyan-200 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-400 text-xs font-semibold placeholder:text-cyan-500/40"
              />
              <button
                onClick={() => handleSend()}
                className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-md shadow-cyan-500/10 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-slate-950 border-2 border-cyan-500 text-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center cursor-pointer relative group overflow-visible"
        title="Jarvis Assistant"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-slate-950 absolute top-0.5 right-0.5 animate-pulse" />
        <Bot size={24} strokeWidth={2.5} className="group-hover:scale-105 transition-transform" />
      </motion.button>
    </div>
  );
}
