import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, deletePredictionRecord } from "../../services/api";
import "./History.css";

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

  if (loading) return <div className="loadingMessage">Loading History...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Prediction History</h1>
        <button onClick={() => navigate("/dashboard")} className="backButton">← Dashboard</button>
      </div>

      {error && <div className="errorMessage">{error}</div>}

      {records.length === 0 ? (
        <p className="emptyMessage">No records found.</p>
      ) : (
        records.map((record) => (
          <div key={record._id} className="recordCard">
            <div className="recordSummary" onClick={() => toggleExpand(record._id)}>
              <div>
                <div className="diseaseName">
                  {record.predictions?.[0]?.disease || "Unknown Condition"}
                </div>
                <div className="dateText">{formatDate(record.createdAt)}</div>
              </div>
              <div className="confidenceContainer">
                <span 
                  className="badge"
                  style={{ backgroundColor: getConfidenceColor(record.predictions?.[0]?.confidence) }}
                >
                  {record.predictions?.[0]?.confidence || "N/A"}
                </span>
                <span style={{color: '#999'}}>{expandedId === record._id ? "▼" : "▶"}</span>
              </div>
            </div>

            {expandedId === record._id && (
              <div className="expandedContent">
                <div style={{marginBottom: '10px'}}>
                  <span className="label">Prediction Type:</span>
                  <span className="value">{record.predictionType === 'blood_report' ? '💉 Blood Report' : '🤒 Symptom Check'}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span className="label">Patient Metrics:</span>
                  <span className="value">Age: {record.age || 'N/A'} | BP: {record.bp || 'N/A'}</span>
                </div>
                {record.symptoms && record.symptoms.length > 0 && (
                  <div style={{marginBottom: '15px'}}>
                    <span className="label">Symptoms:</span>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                      {record.symptoms.map((s, i) => (
                        <span key={i} style={{backgroundColor: '#e7f3ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{textAlign: 'right'}}>
                  <button onClick={() => handleDelete(record._id)} className="deleteButton" disabled={deleting}>
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