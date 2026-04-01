import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);


  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { type: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await API.post("/chat", { message: input });

    // small artificial delay for realism
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: res.data.reply },
      ]);
      setIsTyping(false);
    }, 800);

  } catch {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "AI unavailable right now." },
      ]);
      setIsTyping(false);
    }, 800);
  }
};


  return (
    <>
      <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setOpen(!open)}
  className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full shadow-2xl"
>
  {open ? <X /> : <MessageCircle />}
</motion.button>


      <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 right-6 z-50 w-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl ring-1 ring-white/5"

    >

        <div className="flex items-center justify-between mb-3">
  <p className="text-sm font-semibold tracking-wide">
    HealthAI Assistant
  </p>
  <span className="text-xs text-green-400">● Online</span>
</div>


  <div className="h-60 overflow-y-auto space-y-3 mb-3 flex flex-col">

  {messages.map((msg, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] ${
        msg.type === "user"
          ? "bg-primary text-white self-end"
          : "bg-gray-700 text-gray-200 self-start"
      }`}
    >
      {msg.text}
    </motion.div>
  ))}
 {isTyping && (
  <div className="self-start bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl text-sm flex items-center gap-2 w-fit">

    <span className="text-gray-400 text-xs">HealthAI is typing</span>

    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
    </div>

  </div>
)}



</div>

      

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 p-2 rounded-lg text-sm outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
        />
        <button
          onClick={sendMessage}
          className="bg-primary px-3 rounded-lg text-sm hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
};

export default Chatbot;
