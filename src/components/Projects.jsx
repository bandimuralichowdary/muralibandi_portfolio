import { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching projects:", error);
    else setProjects(data || []);
  };

  const handleOpenModal = (project) => setSelectedProject(project);
  const handleCloseModal = () => setSelectedProject(null);

  return (
    <section
      id="projects"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900/10 p-6 snap-start"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-white drop-shadow-lg">
        Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {projects.length === 0 && (
          <div className="col-span-full text-center text-white/60">
            <p>No projects yet. Visit the Admin Dashboard to add some!</p>
          </div>
        )}
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative glass-card p-6 rounded-3xl shadow-2xl backdrop-blur-3xl border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">
              {project.title}
            </h3>
            <p className="text-white/90 mb-4 line-clamp-3">{project.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags && project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleOpenModal(project)}
              className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-white font-semibold shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </section>
  );
}
