import { motion } from "framer-motion";

export default function ResumeModal({ close, resumeUrl }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-[70%] lg:w-[55%] h-[80%] p-4 relative"
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 text-black text-xl font-bold hover:text-red-600"
        >
          ✕
        </button>

        <iframe
          src={resumeUrl}
          className="w-full h-full rounded-xl"
          title="Resume Viewer"
        ></iframe>
      </motion.div>
    </div>
  );
}
