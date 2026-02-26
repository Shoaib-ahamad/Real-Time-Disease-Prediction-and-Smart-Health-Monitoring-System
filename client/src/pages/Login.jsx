import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      
      // Store token
      localStorage.setItem("token", response.data.token);
      
      // Store user data if provided
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      // Show success message before redirect
      setError(""); // Clear any errors
      
      // Short delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (err) {
      console.error("Login Error:", err);
      
      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("User not found. Please check your email or register");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later");
      } else if (err.code === "ECONNABORTED") {
        setError("Connection timeout. Please check your internet");
      } else if (!err.response) {
        setError("Network error. Please check your connection");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    },
    card: {
      maxWidth: "450px",
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.2)"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "10px"
    },
    subtitle: {
      color: "#666",
      fontSize: "14px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    inputGroup: {
      position: "relative"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#555"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      transition: "all 0.3s",
      outline: "none",
      boxSizing: "border-box"
    },
    passwordToggle: {
      position: "absolute",
      right: "16px",
      top: "41px",
      cursor: "pointer",
      color: "#666",
      fontSize: "14px",
      userSelect: "none"
    },
    button: {
      width: "100%",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "600",
      color: "white",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      position: "relative",
      overflow: "hidden"
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed"
    },
    error: {
      padding: "12px",
      backgroundColor: "#fee",
      border: "1px solid #fcc",  // Fixed: removed quotes around #fcc
      borderRadius: "8px",
      color: "#c00",
      fontSize: "14px",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    footer: {
      textAlign: "center",
      marginTop: "25px",
      color: "#666"
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "600",
      marginLeft: "5px"
    },
    demoCredentials: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "10px",
      fontSize: "13px",
      color: "#666"
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={styles.header}>
          <motion.h1 
            style={styles.title}
            variants={itemVariants}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            style={styles.subtitle}
            variants={itemVariants}
          >
            Sign in to continue to your dashboard
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <motion.div variants={itemVariants} style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants} style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              disabled={loading}
            />
            <span 
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                  Logging in...
                </span>
              ) : "Sign In"}
            </motion.button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.error}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c00" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <circle cx="12" cy="16" r="0.5" fill="#c00"/>
              </svg>
              {error}
            </motion.div>
          )}
        </form>

        {/* Demo Credentials (for testing) */}
        <motion.div 
          variants={itemVariants}
          style={styles.demoCredentials}
        >
          <p style={{ fontWeight: "600", marginBottom: "5px" }}>Demo Credentials:</p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          style={styles.footer}
        >
          Don't have an account? 
          <Link to="/register" style={styles.link}>
            Sign up
          </Link>
        </motion.div>
      </motion.div>

      {/* Add spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;