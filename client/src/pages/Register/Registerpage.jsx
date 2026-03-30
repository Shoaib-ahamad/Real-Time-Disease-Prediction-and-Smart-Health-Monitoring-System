import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import API from "../../services/api";
import Captcha from "../../components/Captcha/Captcha";
import Toast from "../../components/Toast/Toast";
import styles from "../../styles/AuthStyles";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(""), 2800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.name || !data.email || !data.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (userCaptcha !== captchaCode) {
      setError("Invalid captcha");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", data);
      showToast("Registration successful", "success");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setError(message);
      showToast(message, "error");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div style={styles.inputGroup}>
            <User size={18} style={styles.icon} />
            <input
              type="name"
              name="name"
              autoComplete="name"
              value={data.name}
              placeholder="Full Name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={data.email}
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={data.password}
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              style={styles.input}
            />
            <span style={styles.eye} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Captcha onCodeChange={setCaptchaCode} />

          <input
            placeholder="Enter captcha"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            style={{ ...styles.input, marginTop: "10px" }}
          />

          <Toast message={toast} type={toastType} />
          {error && <p style={{ color: "#dc2626", marginTop: "8px" }}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;