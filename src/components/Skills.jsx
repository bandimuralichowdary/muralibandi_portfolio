import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error("Error fetching skills:", error);
    else setSkills(data || []);
  };

  return (
    <section
      id="skills"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900/10 p-6 pt-32 snap-start"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-white drop-shadow-lg text-center">
        Expertise
      </h2>

      {skills.length === 0 ? (
        <div className="text-center text-white/60">
          <p>No skills added yet.</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          {/* Fade Gradients for Glass Effect */}
          <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-gray-900 via-gray-900/50 to-transparent pointer-events-none" />

          {/* Carousel Track */}
          <div
            className="flex gap-8 px-10 py-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-72 snap-center group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-b from-white/20 to-white/5"
              >
                <div className="h-full w-full bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 hover:bg-white/5">

                  {/* Inner Lighting Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-20 h-20 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                      {skill.name.charAt(0)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-premium-accent transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 font-light tracking-wide">{skill.level}</p>

                  {skill.category && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-premium-gold shadow-inner">
                      {skill.category}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6 font-light animate-pulse">
            Swipe to explore
          </p>
        </div>
      )}
    </section>
  );
}
