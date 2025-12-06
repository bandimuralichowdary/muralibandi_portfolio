import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  const links = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const container = document.querySelector(".scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + container.clientHeight / 2;
      setIsScrolled(container.scrollTop > 20);

      links.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) setActiveSection(id);
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const container = document.querySelector(".scroll-container");
    const section = document.getElementById(id);
    if (container && section) {
      container.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 rounded-2xl transition-all duration-300 border border-white/5"
      style={{
        background: isScrolled ? "rgba(5, 5, 16, 0.6)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        height: isScrolled ? 70 : 90,
        boxShadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-center items-center px-6 h-full">

        {/* DESKTOP NAV — CENTERED */}
        <ul className="hidden md:flex gap-10">
          {links.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleLinkClick(link.id)}
                className={`relative px-4 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300
                  ${activeSection === link.id ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/5 shadow-[0_0_15px_rgba(139,92,246,0.3)] -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden absolute right-6">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <HiX size={28} className="text-white" />
            ) : (
              <HiMenu size={28} className="text-white" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex justify-center items-start pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="flex flex-col gap-4 bg-white/10 backdrop-blur-3xl p-6 rounded-2xl shadow-2xl w-[85%] max-w-sm">
              {links.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className={`text-2xl font-bold transition-colors ${activeSection === link.id
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"
                        : "text-white"
                      }`}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
