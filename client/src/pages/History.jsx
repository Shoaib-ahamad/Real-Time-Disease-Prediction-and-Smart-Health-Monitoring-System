import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

 /* const fetchHistory = async () => {
    try {
      const res = await API.get("/predict/history");
      setRecords(res.data);
    } catch (err) {
      console.error("History Error:", err.response?.data || err.message);
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };*/
  const fetchHistory = async () => {
  try {
    const res = await API.get("/predict/history");
    console.log('History response:', res.data); // Debug log
    
    // Handle both response formats
    if (res.data.data && Array.isArray(res.data.data)) {
      setRecords(res.data.data);
    } else if (Array.isArray(res.data)) {
      setRecords(res.data);
    } else {
      console.error('Unexpected response format:', res.data);
      setRecords([]);
      setError("Received unexpected data format from server");
    }
  } catch (err) {
    console.error("History Error:", err.response?.data || err.message);
    setError("Failed to fetch history");
  } finally {
    setLoading(false);
  }
};

 /* const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setDeleting(true);
    try {
      await API.delete(`/predictions/${id}`);
      setRecords(records.filter(record => record._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };*/
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this record?")) {
    return;
  }

  setDeleting(true);
  try {
    // Change this line - wrong endpoint
    // await API.delete(`/predictions/${id}`);  // <-- WRONG
    
    // To this - correct endpoint
    await API.delete(`/predict/${id}`);  // <-- CORRECT
    
    setRecords(records.filter(record => record._id !== id));
  } catch (err) {
    console.error("Delete Error:", err);
    setError("Failed to delete record");
  } finally {
    setDeleting(false);
  }
};

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getConfidenceColor = (confidence) => {
    const num = parseFloat(confidence);
    if (num >= 70) return "#28a745";
    if (num >= 40) return "#ffc107";
    return "#dc3545";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "28px",
      color: "#333",
      margin: 0
    },
    backButton: {
      padding: "10px 20px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s"
    },
    statsCard: {
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "30px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      border: "1px solid #e9ecef"
    },
    statItem: {
      textAlign: "center"
    },
    statValue: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#007bff",
      marginBottom: "5px"
    },
    statLabel: {
      fontSize: "14px",
      color: "#6c757d"
    },
    recordsList: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    recordCard: {
      border: "1px solid #e9ecef",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s"
    },
    recordSummary: {
      padding: "20px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e9ecef"
    },
    summaryLeft: {
      flex: 1
    },
    summaryRight: {
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    mainPrediction: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "5px"
    },
    predictionMeta: {
      display: "flex",
      gap: "15px",
      fontSize: "14px",
      color: "#6c757d"
    },
    confidenceBadge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
      color: "white"
    },
    expandIcon: {
      fontSize: "20px",
      color: "#6c757d",
      transition: "transform 0.2s"
    },
    expandedContent: {
      padding: "20px"
    },
    section: {
      marginBottom: "20px"
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "15px"
    },
    symptomsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "15px"
    },
    symptomTag: {
      backgroundColor: "#e7f3ff",
      color: "#0066cc",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500"
    },
    userDataGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px"
    },
    userDataItem: {
      display: "flex",
      flexDirection: "column"
    },
    userDataLabel: {
      fontSize: "11px",
      color: "#6c757d",
      marginBottom: "4px"
    },
    userDataValue: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#333"
    },
    predictionsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    miniPredictionCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px"
    },
    miniDiseaseName: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#333"
    },
    miniConfidence: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    miniConfidenceBar: {
      width: "100px",
      height: "8px",
      backgroundColor: "#e9ecef",
      borderRadius: "4px",
      overflow: "hidden"
    },
    miniConfidenceFill: {
      height: "100%",
      borderRadius: "4px"
    },
    actionButtons: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
      marginTop: "20px"
    },
    viewButton: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px"
    },
    deleteButton: {
      padding: "8px 16px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px"
    },
    loading: {
      textAlign: "center",
      color: "#007bff",
      fontSize: "18px",
      marginTop: "40px"
    },
    error: {
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      color: "#721c24",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px"
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      border: "2px dashed #dee2e6"
    },
    emptyStateIcon: {
      fontSize: "48px",
      marginBottom: "20px"
    },
    emptyStateTitle: {
      fontSize: "20px",
      color: "#333",
      marginBottom: "10px"
    },
    emptyStateText: {
      color: "#6c757d",
      marginBottom: "20px"
    },
    emptyStateButton: {
      padding: "12px 30px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer"
    }
  };

  // Calculate stats
  const totalPredictions = records.length;
  const uniqueDiseases = new Set(
    records.flatMap(record => 
      record.predictions?.map(p => p.disease) || []
    )
  ).size;
  const averageConfidence = records.length > 0 
    ? Math.round(
        records.reduce((sum, record) => {
          const topPred = record.predictions?.[0];
          return sum + (parseFloat(topPred?.confidence) || 0);
        }, 0) / records.length
      )
    : 0;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your prediction history...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Prediction History</h1>
        <button 
          onClick={() => navigate("/dashboard")} 
          style={styles.backButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {records.length > 0 && (
        <div style={styles.statsCard}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{totalPredictions}</div>
            <div style={styles.statLabel}>Total Predictions</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{uniqueDiseases}</div>
            <div style={styles.statLabel}>Unique Conditions</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{averageConfidence}%</div>
            <div style={styles.statLabel}>Avg. Confidence</div>
          </div>
        </div>
      )}

      {!loading && records.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>📊</div>
          <h3 style={styles.emptyStateTitle}>No History Yet</h3>
          <p style={styles.emptyStateText}>
            You haven't made any predictions yet. Try our health prediction tool to get started!
          </p>
          <button 
            onClick={() => navigate("/health-form")} 
            style={styles.emptyStateButton}
          >
            Make Your First Prediction
          </button>
        </div>
      ) : (
        <div style={styles.recordsList}>
          {records.map((record) => (
            <div key={record._id} style={styles.recordCard}>
              {/* Summary View */}
              <div 
                style={styles.recordSummary}
                onClick={() => toggleExpand(record._id)}
              >
                <div style={styles.summaryLeft}>
                  <div style={styles.mainPrediction}>
                    {record.predictions?.[0]?.disease || record.prediction || "Unknown"}
                  </div>
                  <div style={styles.predictionMeta}>
                    <span>{formatDate(record.createdAt)}</span>
                    <span>{record.symptoms?.length || 0} symptoms</span>
                  </div>
                </div>
                <div style={styles.summaryRight}>
                  {record.predictions?.[0] && (
                    <span 
                      style={{
                        ...styles.confidenceBadge,
                        backgroundColor: getConfidenceColor(record.predictions[0].confidence)
                      }}
                    >
                      {record.predictions[0].confidence}
                    </span>
                  )}
                  <span style={styles.expandIcon}>
                    {expandedId === record._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Expanded View */}
              {expandedId === record._id && (
                <div style={styles.expandedContent}>
                  {/* Symptoms */}
                  {record.symptoms && record.symptoms.length > 0 && (
                    <div style={styles.section}>
                      <h4 style={styles.sectionTitle}>Symptoms</h4>
                      <div style={styles.symptomsContainer}>
                        {record.symptoms.map((symptom, idx) => (
                          <span key={idx} style={styles.symptomTag}>
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Data */}
                  {(record.age || record.temperature || record.bp) && (
                    <div style={styles.section}>
                      <h4 style={styles.sectionTitle}>Health Metrics</h4>
                      <div style={styles.userDataGrid}>
                        {record.age && (
                          <div style={styles.userDataItem}>
                            <span style={styles.userDataLabel}>Age</span>
                            <span style={styles.userDataValue}>{record.age} years</span>
                          </div>
                        )}
                        {record.temperature && (
                          <div style={styles.userDataItem}>
                            <span style={styles.userDataLabel}>Temperature</span>
                            <span style={styles.userDataValue}>{record.temperature}°F</span>
                          </div>
                        )}
                        {record.bp && (
                          <div style={styles.userDataItem}>
                            <span style={styles.userDataLabel}>Blood Pressure</span>
                            <span style={styles.userDataValue}>{record.bp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* All Predictions */}
                  {record.predictions && record.predictions.length > 0 && (
                    <div style={styles.section}>
                      <h4 style={styles.sectionTitle}>All Predictions</h4>
                      <div style={styles.predictionsList}>
                        {record.predictions.map((pred, idx) => (
                          <div key={idx} style={styles.miniPredictionCard}>
                            <span style={styles.miniDiseaseName}>{pred.disease}</span>
                            <div style={styles.miniConfidence}>
                              <div style={styles.miniConfidenceBar}>
                                <div 
                                  style={{
                                    ...styles.miniConfidenceFill,
                                    width: pred.confidence,
                                    backgroundColor: getConfidenceColor(pred.confidence)
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "13px", color: "#666" }}>
                                {pred.confidence}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.viewButton}
                      onClick={() => navigate("/result", { 
                        state: { 
                          predictions: record.predictions,
                          symptoms: record.symptoms,
                          userData: {
                            age: record.age,
                            temperature: record.temperature,
                            bp: record.bp
                          }
                        } 
                      })}
                    >
                      View Details
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(record._id)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;