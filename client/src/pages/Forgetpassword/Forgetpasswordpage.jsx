import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import API from "../../services/api";
import Toast from "../../components/Toast/Toast";
import styles from "../../styles/AuthStyles";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
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
    setMessage("");
    setLink("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      const messageText = res.message || "If email exists, reset instructions were sent.";
      setMessage(messageText);
      setToast(messageText);
      setToastType("success");
      if (res.resetLink) {
        setLink(res.resetLink);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send reset link.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <Toast message={toast} type={toastType} />
          {error && <p style={{ color: "#dc2626", marginTop: "8px" }}>{error}</p>}
          {!toast && message && <p style={{ color: "#16a34a", marginTop: "8px" }}>{message}</p>}
          {link && (
            <p style={{ marginTop: "8px" }}>
              Reset link: <a href={link}>{link}</a>
            </p>
          )}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send Link"}
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

export default ForgotPassword;