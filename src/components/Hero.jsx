import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResumeModal from "./ResumeModal";
import { supabase } from "../lib/supabaseClient";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [showResume, setShowResume] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "Bandi Mohana Sudha Murali Krishna",
    subtitle: "Frontend Developer | Machine Learning Enthusiast | Problem Solver",
    image_url: "",
    resume_url: ""
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setHeroData({
        title: data.title || heroData.title,
        subtitle: data.subtitle || heroData.subtitle,
        image_url: data.image_url || "",
        resume_url: data.resume_url || ""
      });
    }
  };

  const fullText = heroData.title;

  useEffect(() => {
    let index = 0;
    // Reset typing when title changes
    setTypedText("");

    if (!fullText) return;

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-32 pb-20">
      {/* Background with Premium Gradient handled by index.css body, but adding localized effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-blue-600/20 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      <div className="z-10 px-6 max-w-5xl relative flex flex-col items-center">
        {/* Profile Image with Glow Effect */}
        {heroData.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full p-1 bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-md border border-white/20 relative overflow-hidden ring-4 ring-white/5 shadow-2xl">
              <img
                src={heroData.image_url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm uppercase tracking-widest text-premium-accent shadow-lg">
            Portfolio 2025
          </span>
        </motion.div>

        <motion.h1
          key={heroData.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-3 tracking-tight leading-tight"
        >
          <span className="text-white drop-shadow-2xl">{typedText}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl text-gray-400 mb-8 font-light max-w-2xl mx-auto"
        >
          {heroData.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-6 justify-center"
        >
          {heroData.resume_url ? (
            <button
              onClick={() => setShowResume(true)}
              className="glass-button glow-hover group relative overflow-hidden"
            >
              <span className="relative z-10">View Resume</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          ) : (
            <button
              disabled
              className="px-8 py-3 rounded-2xl border border-gray-700 text-gray-500 font-medium cursor-not-allowed bg-black/20"
            >
              No Resume Added
            </button>
          )}

          <a
            href="#contact"
            className="px-8 py-3 rounded-2xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300"
          >
            Contact Me
          </a>
        </motion.div>
      </div>

      {showResume && <ResumeModal resumeUrl={heroData.resume_url} close={() => setShowResume(false)} />}
    </section>
  );
}
