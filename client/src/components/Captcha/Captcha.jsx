import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import "./Captcha.css";

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const Captcha = ({ onCodeChange }) => {
  const canvasRef = useRef(null);

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = "#e6ecf2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw characters
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      const fontSize = 22 + Math.random() * 6;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = `rgb(${Math.random()*100}, ${Math.random()*100}, ${Math.random()*100})`;

      const x = 10 + i * 25;
      const y = 30 + Math.random() * 5;

      const angle = (Math.random() - 0.5) * 0.7;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(0,0,0,0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 150, Math.random() * 50);
      ctx.lineTo(Math.random() * 150, Math.random() * 50);
      ctx.stroke();
    }

    // noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.arc(Math.random() * 150, Math.random() * 50, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const refresh = () => {
    const newCode = generateCode();
    onCodeChange(newCode);
    drawCaptcha(newCode);
  };

  useEffect(() => {
    const initialCode = generateCode();
    onCodeChange(initialCode);
    drawCaptcha(initialCode);
  }, [onCodeChange]);

  return (
    <div className="wrapper">
      <canvas ref={canvasRef} width={150} height={50} className="canvas" />

      <button onClick={refresh} className="button">
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

export default Captcha;