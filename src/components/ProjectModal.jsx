import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden border border-white/10 bg-gray-900/50"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
            <div className="flex flex-wrap gap-2">
              {(project.tags || []).map((tag, i) => (
                <span key={i} className="text-xs font-medium px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-300 leading-relaxed text-sm">
            {project.description}
          </p>

          {/* Actions */}
          <div className="grid gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <FaExternalLinkAlt /> Visit Live Site
              </a>
            )}

            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
              >
                <FaGithub size={18} /> View Source Code
              </a>
            )}

            {/* Fallback if no links */}
            {!project.link && !project.github_link && (
              <p className="text-center text-gray-500 text-sm italic">No links available for this project.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
