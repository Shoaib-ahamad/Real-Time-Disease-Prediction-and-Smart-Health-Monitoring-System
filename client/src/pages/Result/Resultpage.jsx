import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { predictions, symptoms, reportData, predictionType, userData } = location.state || {};

  if (!predictions || predictions.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
        <h2>No prediction data found.</h2>
        <button
          style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}
          onClick={() => navigate("/health-form")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const topPrediction = predictions[0];
  const recs = topPrediction?.recommendation;

  const styles = {
    container: { maxWidth: "900px", margin: "30px auto", padding: "20px", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: "#333" },
    card: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", marginBottom: "25px", border: "1px solid #e2e8f0" },
    mainTitle: { textAlign: "center", fontSize: "28px", color: "#1e293b", marginBottom: "30px", fontWeight: "700" },
    sectionTitle: { fontSize: "20px", color: "#1e293b", marginBottom: "20px", fontWeight: "600", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" },

    // Top Prediction Styling
    predictionBox: { padding: "25px", borderRadius: "8px", backgroundColor: "#f8fafc", marginBottom: "20px", borderLeft: "6px solid #ef4444" },
    diseaseName: { fontSize: "26px", fontWeight: "700", color: "#0f172a" },
    confidence: { fontSize: "16px", color: "#64748b", marginTop: "5px" },
    statusBadge: { display: "inline-block", marginTop: "12px", color: "#b91c1c", fontWeight: "bold", fontSize: "14px" },

    // Action Plan Grid
    actionPlanHeader: { fontSize: "18px", fontWeight: "bold", color: "#334155", display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    infoBox: { padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#fff" },
    boxTitle: { fontWeight: "bold", fontSize: "15px", color: "#1e293b", marginBottom: "8px" },
    boxContent: { fontSize: "14px", color: "#475569", lineHeight: "1.6", whiteSpace: "pre-line" },

    // Precaution Styling
    precautionBox: { padding: "20px", borderRadius: "10px", backgroundColor: "#fff1f2", border: "1px solid #fecdd3", marginTop: "20px" },
    precautionTitle: { color: "#9f1239", fontWeight: "bold", fontSize: "16px", marginBottom: "8px" },
    precautionText: { color: "#e11d48", fontSize: "14px", fontWeight: "500", lineHeight: "1.7", whiteSpace: "pre-line" },

    // Tables & Badges
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: { textAlign: "left", padding: "12px", backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "14px", color: "#64748b" },
    td: { padding: "12px", borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#1e293b" },
    badge: { display: "inline-block", padding: "5px 12px", borderRadius: "20px", backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "12px", marginRight: "8px", marginBottom: "8px", fontWeight: "500" },

    navBtn: { display: "block", margin: "40px auto", padding: "14px 40px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "16px" }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Health Analysis Report</h1>

      {/* 1. PRIMARY ASSESSMENT (The New Look) */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Primary Assessment</h2>
        <div style={styles.predictionBox}>
          <div style={styles.diseaseName}>{topPrediction.disease}</div>
          <div style={styles.confidence}>Model Confidence: {topPrediction.confidence}</div>
          <div style={styles.statusBadge}>Status: High (Clinical Urgent)</div>
        </div>

        <div style={styles.actionPlanHeader}>📋 Clinical Action Plan</div>
        <div style={styles.grid}>
          <div style={styles.infoBox}>
            <div style={styles.boxTitle}>🥗 Suggested Diet</div>
            <div style={styles.boxContent}>{recs?.diet || "Not specified."}</div>
          </div>
          <div style={styles.infoBox}>
            <div style={styles.boxTitle}>🧘 Lifestyle Changes</div>
            <div style={styles.boxContent}>{recs?.lifestyle || "Not specified."}</div>
          </div>
        </div>

        {recs?.precautions && (
          <div style={styles.precautionBox}>
            <div style={styles.precautionTitle}>⚠️ Important Precautions</div>
            <div style={styles.precautionText}>{recs.precautions}</div>
          </div>
        )}
      </div>

      {/* 2. INPUT SUMMARY & SYMPTOMS */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Patient Input Summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div><strong>Age:</strong> {userData?.age || "N/A"}</div>
          <div><strong>BP:</strong> {userData?.bp || "N/A"}</div>
          {userData?.temperature && <div><strong>Temp:</strong> {userData?.temperature}°F</div>}
        </div>

        {predictionType === "symptoms" && symptoms?.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <strong style={{ display: "block", marginBottom: "10px" }}>Reported Symptoms:</strong>
            {symptoms.map((s, i) => (
              <span key={i} style={styles.badge}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* 3. BLOOD REPORT DATA (Dynamic Table) */}
      {predictionType === "report" && reportData && (
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Detailed Blood Parameters</h2>
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Parameter</th>
                  <th style={styles.th}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(reportData).map(([key, value]) => (
                  <tr key={key}>
                    <td style={styles.td}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DIFFERENTIAL DIAGNOSIS (Other Possibilities) */}
      {predictions.length > 1 && (
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Differential Diagnosis (Secondary)</h2>
          {predictions.slice(1).map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontWeight: "500", color: "#475569" }}>{p.disease}</span>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>{p.confidence} Match</span>
            </div>
          ))}
        </div>
      )}

      <button style={styles.navBtn} onClick={() => navigate("/health-form")}>
        Perform New Analysis
      </button>

      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginBottom: "50px" }}>
        *Disclaimer: This AI assessment is for informational purposes only and does not replace professional medical advice.
      </p>
    </div>
  );
};

export default Result;
