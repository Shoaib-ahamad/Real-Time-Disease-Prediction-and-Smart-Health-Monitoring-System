import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import Chatbot from "../Chatbot/Chatbot";
import { secureStorage } from "../../utils/secureStorage";

import { LayoutDashboard, Activity, History, LogOut } from "lucide-react";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Clear stored credentials securely
    secureStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-wide mb-12 text-primary">
            HealthAI
          </h1>

          <nav className="space-y-2 text-gray-300">

  {[
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "New Prediction", path: "/health-form", icon: Activity },
    { name: "History", path: "/history", icon: History },
  ].map((item) => (
    <NavLink key={item.name} to={item.path}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 6 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition
            ${
              isActive
                ? "bg-white/10 text-white shadow-lg"
                : "hover:bg-white/5"
            }
          `}
        >
          <item.icon size={20} />
          {item.name}
        </motion.div>
      )}
    </NavLink>
  ))}

</nav>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
        <Chatbot />
      </main>
    </div>
  );
};

export default Layout;
