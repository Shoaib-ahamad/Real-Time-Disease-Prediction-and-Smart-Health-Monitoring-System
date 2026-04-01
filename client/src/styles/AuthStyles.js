const AuthStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(140deg, #2f4fea 0%, #7c3aed 50%, #5628cd 100%)",
    padding: "15px",
  },

  card: {
    width: "400px",
    padding: "34px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.38)",
    backdropFilter: "blur(10px)",
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#333",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#777",
  },

  inputGroup: {
    position: "relative",
    marginBottom: "18px",
  },

  icon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
  },

  input: {
    width: "100%",
    padding: "12px 44px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    background: "#fff",
    color: "#111827",
    transition: "all 0.25s ease",
  },
  inputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102,126,234,0.2)",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#777",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(90deg,#5966f4,#7269f5)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "14px",
    fontSize: "15px",
    letterSpacing: "0.5px",
    transition: "opacity 0.25s ease, transform 0.25s ease",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },

  link: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  footer: {
    textAlign: "center",
    marginTop: "15px",
  },
};

export default AuthStyles;