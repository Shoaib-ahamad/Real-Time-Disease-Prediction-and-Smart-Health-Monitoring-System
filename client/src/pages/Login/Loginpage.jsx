import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import API from "../../services/api";
import Captcha from "../../components/Captcha/Captcha";
import Toast from "../../components/Toast/Toast";
import styles from "../../styles/AuthStyles";
import { secureStorage } from "../../utils/secureStorage";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Load stored credentials on component mount
  useEffect(() => {
    const loadCredentials = async () => {
      // Try Credential Management API first
      if (window.navigator.credentials && window.PasswordCredential) {
        try {
          const cred = await navigator.credentials.get({ password: true });
          if (cred && cred.type === "password") {
            setFormData({
              email: cred.id || "",
              password: cred.password || "",
            });
            return;
          }
        } catch (error) {
          console.log("Credential Management API not available, trying localStorage:", error.message);
        }
      }

      // Fallback to secure localStorage
      const secureData = secureStorage.getItem('secureCredentials');

      if (secureData) {
        setFormData({
          email: secureData.email || "",
          password: secureData.password || "",
        });
      }
    };


    loadCredentials();
  }, []);

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(""), 2800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userCaptcha !== captchaCode) {
      setError("Invalid captcha");
      showToast("Invalid captcha", "error");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      secureStorage.setItem('secureCredentials', formData);

      showToast("Login successful", "success");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
<p style={styles.subtitle}>Login to your account</p>

        <Toast message={toast} type={toastType} />

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="on" data-form-type="login">
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={styles.input}
              required
            />
            <span style={styles.eye} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Captcha onCodeChange={setCaptchaCode} />

          <input
            placeholder="Enter captcha"
            onChange={(e) => setUserCaptcha(e.target.value)}
            style={{ ...styles.input, marginTop: "10px" }}
          />

          <button style={{ ...styles.button, opacity: loading ? 0.65 : 1 }} type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div style={{ ...styles.footer, display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;