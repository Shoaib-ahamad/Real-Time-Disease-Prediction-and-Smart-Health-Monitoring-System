import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");

  const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log("Fetching history from API...");
      
      // Try the correct endpoint (plural 'predictions')
      const res = await API.get("/predict/history");
      console.log("API Response:", res.data);
      
      // Handle different response formats
      if (Array.isArray(res.data)) {
        setRecords(res.data);
      } else if (res.data.records) {
        setRecords(res.data.records);
      } else {
        console.warn("Unexpected data format:", res.data);
        setRecords([]);
      }
      
      setError("");
    } catch (err) {
      console.error("Dashboard Error Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      // Try fallback endpoint
      try {
        console.log("Trying fallback endpoint...");
        const fallbackRes = await API.get("/predict/history");
        if (Array.isArray(fallbackRes.data)) {
          setRecords(fallbackRes.data);
        } else if (fallbackRes.data.records) {
          setRecords(fallbackRes.data.records);
        }
        setError("");
      } catch (fallbackErr) {
        setError(err.response?.data?.message || "Failed to fetch history");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on time range
  const getFilteredRecords = () => {
    if (selectedTimeRange === "all") return records;
    
    const now = new Date();
    const daysMap = {
      week: 7,
      month: 30,
      year: 365
    };
    
    const cutoff = new Date(now.setDate(now.getDate() - daysMap[selectedTimeRange]));
    return records.filter(record => new Date(record.createdAt) >= cutoff);
  };

  const filteredRecords = getFilteredRecords();

  // ====== Stats Calculation ======
  const totalPredictions = filteredRecords.length;

  // Get last prediction details
  const lastPrediction = filteredRecords.length > 0 
    ? filteredRecords[0].predictions?.[0]?.disease || filteredRecords[0].prediction || "N/A"
    : "N/A";
  
  const lastPredictionConfidence = filteredRecords.length > 0
    ? filteredRecords[0].predictions?.[0]?.confidence || "0%"
    : "0%";

  // Disease frequency from all predictions
  const diseaseCount = {};
  const confidenceTrends = [];
  
  filteredRecords.forEach((rec, index) => {
    if (rec.predictions && Array.isArray(rec.predictions)) {
      // Count each prediction for frequency
      rec.predictions.forEach(pred => {
        diseaseCount[pred.disease] = (diseaseCount[pred.disease] || 0) + 1;
      });
      
      // Collect confidence trends
      confidenceTrends.unshift({
        date: new Date(rec.createdAt).toLocaleDateString(),
        confidence: parseFloat(rec.predictions[0]?.confidence) || 0,
        disease: rec.predictions[0]?.disease
      });
    } else if (rec.prediction) {
      // Fallback for old format
      diseaseCount[rec.prediction] = (diseaseCount[rec.prediction] || 0) + 1;
      confidenceTrends.unshift({
        date: new Date(rec.createdAt).toLocaleDateString(),
        confidence: parseFloat(rec.risk) || 0,
        disease: rec.prediction
      });
    }
  });

  // Most frequent disease
  const mostFrequentDisease = Object.keys(diseaseCount).length > 0
    ? Object.keys(diseaseCount).reduce((a, b) =>
        diseaseCount[a] > diseaseCount[b] ? a : b
      )
    : "N/A";

  const mostFrequentCount = mostFrequentDisease !== "N/A" 
    ? diseaseCount[mostFrequentDisease] 
    : 0;

  // Chart data
  const chartData = Object.keys(diseaseCount).map((disease) => ({
    name: disease.length > 15 ? disease.substring(0, 12) + "..." : disease,
    fullName: disease,
    count: diseaseCount[disease],
  })).sort((a, b) => b.count - a.count).slice(0, 8);

  // Calculate average confidence
  const avgConfidence = filteredRecords.length > 0
    ? Math.round(
        filteredRecords.reduce((sum, rec) => {
          if (rec.predictions?.[0]?.confidence) {
            return sum + parseFloat(rec.predictions[0].confidence);
          }
          return sum + (parseFloat(rec.risk) || 0);
        }, 0) / filteredRecords.length
      )
    : 0;

  // Get unique conditions count
  const uniqueConditions = Object.keys(diseaseCount).length;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-10"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {/* Header with Time Filter */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Overview of your health predictions and activity.
          </p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-1">
          {[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
            { value: "all", label: "All" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeRange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedTimeRange === option.value
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400"
        >
          <p>Error: {error}</p>
          <button 
            onClick={fetchHistory}
            className="mt-2 text-sm underline hover:text-red-300"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Overview Cards */}
      <motion.section
        className="space-y-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-lg text-gray-400 uppercase tracking-wider">
          Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Predictions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl"></div>
            <p className="text-gray-400 text-sm">Total Predictions</p>
            <h2 className="text-4xl font-bold mt-2 text-white">
              {totalPredictions}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              {selectedTimeRange !== "all" ? `Last ${selectedTimeRange}` : "All time"}
            </p>
          </motion.div>

          {/* Unique Conditions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-secondary opacity-10 rounded-full blur-3xl"></div>
            <p className="text-gray-400 text-sm">Unique Conditions</p>
            <h2 className="text-4xl font-bold mt-2 text-white">
              {uniqueConditions}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Different diseases predicted
            </p>
          </motion.div>

          {/* Most Frequent */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
            <p className="text-gray-400 text-sm">Most Frequent</p>
            <h2 className="text-xl font-bold mt-2 text-white line-clamp-1">
              {mostFrequentDisease}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              {mostFrequentCount} times
            </p>
          </motion.div>

          {/* Avg Confidence */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
            <p className="text-gray-400 text-sm">Avg. Confidence</p>
            <h2 className="text-4xl font-bold mt-2 text-white">
              {avgConfidence}%
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Based on top predictions
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Analytics Section */}
      <motion.section
        className="space-y-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-lg text-gray-400 uppercase tracking-wider">
          Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disease Distribution Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-white font-semibold mb-4">Disease Distribution</h3>
            {chartData.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                No prediction data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" stroke="#aaa" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#aaa" 
                    width={100}
                    tick={{ fontSize: 12, fill: "#aaa" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                    formatter={(value, name, props) => [value, props.payload.fullName]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="count"
                    fill="url(#colorGradient)"
                    radius={[0, 12, 12, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Confidence Trends */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-white font-semibold mb-4">Confidence Trends</h3>
            {confidenceTrends.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                No trend data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={confidenceTrends.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#aaa" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tick={{ fontSize: 10, fill: "#aaa" }}
                  />
                  <YAxis stroke="#aaa" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                    formatter={(value, name, props) => [
                      `${value}%`,
                      `Confidence for ${props.payload.disease}`
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </motion.section>

      {/* Recent Activity Section */}
      <motion.section
        className="space-y-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-lg text-gray-400 uppercase tracking-wider">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {filteredRecords.slice(0, 5).map((rec) => (
            <motion.div
              key={rec._id}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:bg-white/10 transition cursor-pointer"
              onClick={() => navigate("/result", { 
                state: { 
                  predictions: rec.predictions,
                  symptoms: rec.symptoms,
                  userData: {
                    age: rec.age,
                    temperature: rec.temperature,
                    bp: rec.bp
                  }
                } 
              })}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-medium text-lg text-white">
                    {rec.predictions?.[0]?.disease || rec.prediction || "Unknown"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rec.symptoms && rec.symptoms.slice(0, 3).map((symptom, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                      >
                        {symptom}
                      </span>
                    ))}
                    {rec.symptoms?.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                        +{rec.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    {rec.predictions?.[0] && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: parseFloat(rec.predictions[0].confidence) >= 70 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : parseFloat(rec.predictions[0].confidence) >= 40 
                              ? 'rgba(234, 179, 8, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                          color: parseFloat(rec.predictions[0].confidence) >= 70 
                            ? '#4ade80' 
                            : parseFloat(rec.predictions[0].confidence) >= 40 
                              ? '#fbbf24'
                              : '#f87171'
                        }}
                      >
                        {rec.predictions[0].confidence}
                      </span>
                    )}
                    <p className="text-gray-400 text-sm">
                      {new Date(rec.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {(rec.age || rec.temperature || rec.bp) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Age: {rec.age || 'N/A'} • Temp: {rec.temperature || 'N/A'}°F • BP: {rec.bp || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRecords.length > 5 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-gray-400 hover:text-white transition"
            onClick={() => navigate("/history")}
          >
            View All History →
          </motion.button>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;