import "./Toast.css";

const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  const toastClass = type === "success" ? "success" : "error";

  return (
    <div className={`toast ${toastClass}`}>
      {message}
    </div>
  );
};

export default Toast;
