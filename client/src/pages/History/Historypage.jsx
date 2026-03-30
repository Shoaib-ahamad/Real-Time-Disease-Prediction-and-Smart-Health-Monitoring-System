import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, deletePredictionRecord } from "../../services/api";

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load history:", err.message);
      setError("Failed to load your history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setDeleting(true);
    try {
      await deletePredictionRecord(id);
      setRecords(records.filter(record => record._id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err.message);
      setError("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const getConfidenceColor = (confidence) => {
    const num = parseFloat(confidence);
    if (num >= 70) return "#28a745";
    if (num >= 40) return "#ffc107";
    return "#dc3545";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const styles = {
    container: { maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    title: { fontSize: "28px", color: "#333333" }, // Forced Dark
    backButton: { padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    recordCard: { border: "1px solid #e9ecef", borderRadius: "10px", marginBottom: "15px", backgroundColor: "#ffffff", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    recordSummary: { padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8f9fa" },
    diseaseName: { fontSize: "18px", fontWeight: "bold", color: "#212529", marginBottom: "4px" }, // FIXED: Explicit Dark Text
    dateText: { fontSize: "13px", color: "#6c757d" }, // Explicit Gray Text
    expandedContent: { padding: "20px", borderTop: "1px solid #eee", backgroundColor: "#ffffff" },
    label: { fontWeight: "bold", color: "#495057", marginRight: "10px" },
    value: { color: "#212529" },
    badge: { color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    deleteButton: { padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', color: '#007bff'}}>Loading History...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Prediction History</h1>
        <button onClick={() => navigate("/dashboard")} style={styles.backButton}>← Dashboard</button>
      </div>

      {error && <div style={{color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>{error}</div>}

      {records.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666'}}>No records found.</p>
      ) : (
        records.map((record) => (
          <div key={record._id} style={styles.recordCard}>
            <div style={styles.recordSummary} onClick={() => toggleExpand(record._id)}>
              <div>
                {/* DISEASE NAME - NOW FORCED DARK */}
                <div style={styles.diseaseName}>
                  {record.predictions?.[0]?.disease || "Unknown Condition"}
                </div>
                <div style={styles.dateText}>{formatDate(record.createdAt)}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <span style={{...styles.badge, backgroundColor: getConfidenceColor(record.predictions?.[0]?.confidence)}}>
                  {record.predictions?.[0]?.confidence || "N/A"}
                </span>
                <span style={{color: '#999'}}>{expandedId === record._id ? "▼" : "▶"}</span>
              </div>
            </div>

            {expandedId === record._id && (
              <div style={styles.expandedContent}>
                <div style={{marginBottom: '10px'}}>
                  <span style={styles.label}>Prediction Type:</span>
                  <span style={styles.value}>{record.predictionType === 'blood_report' ? '💉 Blood Report' : '🤒 Symptom Check'}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={styles.label}>Patient Metrics:</span>
                  <span style={styles.value}>Age: {record.age || 'N/A'} | BP: {record.bp || 'N/A'}</span>
                </div>
                {record.symptoms && record.symptoms.length > 0 && (
                  <div style={{marginBottom: '15px'}}>
                    <span style={styles.label}>Symptoms:</span>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                      {record.symptoms.map((s, i) => (
                        <span key={i} style={{backgroundColor: '#e7f3ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{textAlign: 'right'}}>
                  <button onClick={() => handleDelete(record._id)} style={styles.deleteButton} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete Record"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default History;