const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: "relative",
        marginBottom: "12px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: type === "success" ? "#dcfce7" : "#fee2e2",
        color: type === "success" ? "#166534" : "#991b1b",
        border: "1px solid",
        borderColor: type === "success" ? "#86efac" : "#fecaca",
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
