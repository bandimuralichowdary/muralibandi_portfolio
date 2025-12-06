
import { useState, useEffect, useContext, useCallback } from "react";
import { AdminContext } from "../../context/AdminContext";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaRocket, FaHammer, FaEnvelope, FaPen, FaTrash, FaPlus, FaSave, FaTimes, FaCrop } from "react-icons/fa";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../lib/cropUtils";

export default function AdminDashboard() {
    const { logout } = useContext(AdminContext);
    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
    const [uploading, setUploading] = useState(false);

    // Cropper State
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);

    // Tab configurations
    const tabs = [
        { id: "hero", label: "Hero", icon: FaRocket },
        { id: "projects", label: "Projects", icon: FaHammer },
        { id: "skills", label: "Skills", icon: FaPen },
        { id: "messages", label: "Messages", icon: FaEnvelope },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const { data: result, error } = await supabase
            .from(activeTab === "messages" ? "messages" : activeTab) // Adjust table names if needed
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching data:", error);
        else setData(result || []);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        const { error } = await supabase
            .from(activeTab === "messages" ? "messages" : activeTab)
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete Error:", error);
            alert(`Error deleting item: ${error.message}\n\nTip: If this is a permission error, make sure you ran the 'fix_message_policies.sql' script in Supabase.`);
        } else {
            fetchData();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData.entries());

        // Basic cleaning for certain types
        if (activeTab === "projects" && updates.tags) {
            updates.tags = updates.tags.split(",").map(t => t.trim());
        }

        // Handle File Upload for Hero
        if (activeTab === "hero" && uploadMode === "file") {
            // Use the cropped file if available, otherwise check input (fallback)
            let file = fileToUpload;

            if (file) {
                try {
                    setUploading(true);

                    // Generate unique filename
                    const fileExt = "png"; // Cropped images are PNGs now
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('hero-images')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    // Get Public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('hero-images')
                        .getPublicUrl(filePath);

                    updates.image_url = publicUrl;
                    setUploading(false);
                } catch (error) {
                    console.error("Upload error:", error);
                    alert("Error uploading image: " + error.message);
                    setUploading(false);
                    return;
                }
            }
        }

        // Handle Resume Upload
        const resumeFile = formData.get("resume_file");
        if (activeTab === "hero" && resumeFile && resumeFile.size > 0) {
            try {
                setUploading(true);
                const fileExt = resumeFile.name.split('.').pop();
                const fileName = `resume_${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, resumeFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                updates.resume_url = publicUrl;
                setUploading(false);
            } catch (error) {
                console.error("Resume upload error:", error);
                alert("Error uploading resume: " + error.message);
                setUploading(false);
            }
        }

        // Clean updates object of temporary file inputs
        delete updates.resume_file;

        let error;
        if (editingItem && editingItem.id) {
            // Update
            const { error: updateError } = await supabase
                .from(activeTab)
                .update(updates)
                .eq("id", editingItem.id);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from(activeTab)
                .insert([updates]);
            error = insertError;
        }

        if (error) {
            console.error(error);
            alert("Error saving data: " + error.message);
        } else {
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
        setFileToUpload(null); // Reset file on new open
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result);
                setIsCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            setFileToUpload(croppedImageBlob);
            setIsCropModalOpen(false);
        } catch (e) {
            console.error(e);
            alert("Error creating cropped image");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-10">
                    Admin Console
                </h1>

                <nav className="flex-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto relative">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold capitalize">{activeTab} Manager</h2>
                    {activeTab !== "messages" && (
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                            <FaPlus /> Add New
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {data.length === 0 && <p className="text-gray-500 col-span-full text-center">No records found.</p>}
                            {data.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg truncate pr-8">{item.title || item.name || item.email || "Untitled"}</h3>
                                        <div className="flex gap-2">
                                            {activeTab === "messages" ? (
                                                <>
                                                    <button onClick={() => openModal(item)} className="p-2 bg-gray-800 rounded-lg hover:text-blue-400 transition-colors" title="View Message"><FaEnvelope size={14} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-800 rounded-lg hover:text-red-400 transition-colors" title="Delete Message"><FaTrash size={14} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => openModal(item)} className="p-2 bg-gray-800 rounded-lg hover:text-blue-400 transition-colors"><FaPen size={14} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-800 rounded-lg hover:text-red-400 transition-colors"><FaTrash size={14} /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-gray-400 text-sm space-y-2">
                                        {Object.entries(item).slice(1, 4).map(([key, value]) => {
                                            if (key === "id" || key === "created_at" || key === "image_url") return null;
                                            return (
                                                <p key={key} className="truncate">
                                                    <span className="opacity-50 capitalize mr-2">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : value}
                                                </p>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes /></button>
                            <h3 className="text-2xl font-bold mb-6">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>

                            <form onSubmit={handleSave} className="space-y-4">
                                {/* Dynamic Form Generation based on Active Tab */}
                                {activeTab === "hero" && (
                                    <>
                                        <Input label="Title" name="title" defaultValue={editingItem?.title} />
                                        <Input label="Subtitle" name="subtitle" defaultValue={editingItem?.subtitle} />

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 block">Image Source</label>
                                            <div className="flex gap-4 mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode("url")}
                                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${uploadMode === "url" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}`}
                                                >
                                                    Image URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode("file")}
                                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${uploadMode === "file" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}`}
                                                >
                                                    Upload File
                                                </button>
                                            </div>

                                            {uploadMode === "url" ? (
                                                <Input label="Image URL" name="image_url" defaultValue={editingItem?.image_url} placeholder="https://example.com/image.jpg" />
                                            ) : (
                                                <div className="bg-black/20 border border-gray-700 rounded-lg p-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={onFileChange}
                                                        className="text-white w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                                    />
                                                    {fileToUpload && <p className="text-green-400 text-xs mt-2 font-semibold">Ready to upload (Cropped)</p>}
                                                    <p className="text-xs text-gray-500 mt-2">Uploads to 'hero-images' bucket.</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-gray-800">
                                            <label className="text-sm font-medium text-gray-400 block">Resume File (PDF)</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input label="Resume URL (Link)" name="resume_url" defaultValue={editingItem?.resume_url} placeholder="https://example.com/resume.pdf" required={false} />
                                                </div>
                                                {editingItem?.resume_url && (
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                if (!confirm("Remove resume link?")) return;
                                                                const { error } = await supabase.from('hero').update({ resume_url: "" }).eq('id', editingItem.id);
                                                                if (error) alert("Error removing resume");
                                                                else {
                                                                    setEditingItem({ ...editingItem, resume_url: "" });
                                                                    fetchData();
                                                                }
                                                            }}
                                                            className="mb-1 p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/30 transition-colors"
                                                            title="Run Remove"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 text-center mb-2">- OR -</p>
                                            <div className="bg-black/20 border border-gray-700 rounded-lg p-3">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    name="resume_file"
                                                    className="text-white w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Uploads to 'resumes' bucket.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {activeTab === "projects" && (
                                    <>
                                        <Input label="Title" name="title" defaultValue={editingItem?.title} />
                                        <Input label="Description" name="description" as="textarea" defaultValue={editingItem?.description} />
                                        <Input label="Link" name="link" defaultValue={editingItem?.link} />
                                        <Input label="GitHub" name="github_link" defaultValue={editingItem?.github_link} />
                                        <Input label="Tags (comma separated)" name="tags" defaultValue={editingItem?.tags?.join(", ")} />
                                    </>
                                )}
                                {activeTab === "skills" && (
                                    <>
                                        <Input label="Name" name="name" defaultValue={editingItem?.name} />
                                        <Input label="Level" name="level" defaultValue={editingItem?.level} />
                                        <Input label="Category" name="category" defaultValue={editingItem?.category} />
                                    </>
                                )}
                                {activeTab === "messages" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-400 block mb-1">From</label>
                                            <div className="text-white text-lg font-semibold">{editingItem?.name}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-400 block mb-1">Email</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (editingItem?.email) {
                                                        const link = `mailto:${editingItem.email}`;
                                                        window.location.href = link;
                                                    }
                                                }}
                                                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 group relative"
                                            >
                                                <FaEnvelope /> {editingItem?.email}
                                                <span
                                                    className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(editingItem?.email);
                                                        alert("Email copied!");
                                                    }}
                                                >
                                                    Copy
                                                </span>
                                            </button>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                                            <label className="text-sm font-medium text-gray-400 block mb-2">Message</label>
                                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{editingItem?.message}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-800 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (editingItem?.email) {
                                                        const link = `mailto:${editingItem.email}`;
                                                        console.log("Opening mailto:", link);
                                                        window.location.href = link;
                                                    } else {
                                                        alert("No email address available.");
                                                    }
                                                }}
                                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold hover:shadow-lg transition-all"
                                            >
                                                Reply via Email
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab !== "messages" && (
                                    <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:shadow-lg transition-all">
                                        Save Changes
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Crop Modal */}
            <AnimatePresence>
                {isCropModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black flex flex-col"
                    >
                        <div className="relative flex-1 w-full bg-black">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Square aspect ratio for profile
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round" // Round crop for profile
                                showGrid={false}
                            />
                        </div>
                        {/* Controls */}
                        <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-8">
                            <div className="w-1/3 flex items-center gap-4">
                                <span className="text-gray-400 text-sm font-medium">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-40 accent-purple-500"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsCropModalOpen(false)}
                                    className="px-6 py-2 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCropSave}
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 text-white font-bold transition-all shadow-lg"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Input = ({ label, name, defaultValue, as = "input", required = true, placeholder = "" }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400 block">{label}</label>
        {as === "textarea" ? (
            <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" rows={3} required={required} />
        ) : (
            <input type="text" name={name} defaultValue={defaultValue} placeholder={placeholder} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" required={required} />
        )}

    </div>
);
