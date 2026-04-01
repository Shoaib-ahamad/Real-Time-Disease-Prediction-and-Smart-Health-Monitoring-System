import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import API from "../../services/api";
import Toast from "../../components/Toast/Toast";
import styles from "../../styles/AuthStyles";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(""), 2800);
  };
  useEffect(() => {
    if (!token) {
      setError("Missing token in URL. Please use the link from your email.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is required");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", { token, password });
      const successMessage = "Password reset successful. Redirecting to login...";
      setMessage(successMessage);
      showToast(successMessage, "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="New password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            <span
              style={styles.eye}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Toast message={toast} type={toastType} />
          {error && <p style={{ color: "#dc2626", marginTop: "8px" }}>{error}</p>}
          {message && <p style={{ color: "#16a34a", marginTop: "8px" }}>{message}</p>}

          <button style={styles.button} type="submit" disabled={loading || !token}>
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/" style={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
