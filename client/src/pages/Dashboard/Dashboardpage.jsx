import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getHistory(); // Uses the function from api.js
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Logic for Chart Data
  const diseaseCount = {};
  records.forEach(rec => {
    // Check both the new array format and the fallback prediction string
    const disease = rec.predictions?.[0]?.disease || rec.prediction || "Unknown";
    diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
  });

  const chartData = Object.keys(diseaseCount).map(name => ({
    name: name.length > 12 ? name.substring(0, 10) + '..' : name,
    count: diseaseCount[name]
  })).slice(0, 5);

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading Dashboard...</div>;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Health Dashboard</h1>
        <button onClick={fetchData} className="text-sm text-blue-400 underline">Refresh Data</button>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-lg">{error}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Total Analyses</p>
          <h2 className="text-4xl font-bold text-white">{records.length}</h2>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Top Condition</p>
          <h2 className="text-xl font-bold text-white truncate">
            {Object.keys(diseaseCount).sort((a,b) => diseaseCount[b] - diseaseCount[a])[0] || "N/A"}
          </h2>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Service Status</p>
          <h2 className="text-xl font-bold text-green-400">Connected</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-80">
          <h3 className="text-white mb-4">Common Conditions</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {records.slice(0, 3).map(rec => (
              <div key={rec._id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm font-medium">{rec.predictions?.[0]?.disease}</span>
                <span className="text-xs text-gray-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            <button onClick={() => navigate("/history")} className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
              View Full History →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;