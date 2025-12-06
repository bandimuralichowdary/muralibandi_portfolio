
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { motion } from "framer-motion";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AdminContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate("/admin/dashboard");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-700/30 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10"
            >
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 text-center">
                    Admin Access
                </h2>
                <p className="text-gray-400 text-center mb-8">Welcome back, Commander.</p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-6 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                            placeholder="Enter password"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 mt-4"
                    >
                        Authenticate
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
