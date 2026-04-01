import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { predictions, symptoms, reportData, predictionType, userData } = location.state || {};

  if (!predictions || predictions.length === 0) {
    return (
      <div className="container">
        <h2>No prediction data found.</h2>
        <button
          className="navBtn"
          onClick={() => navigate("/health-form")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const topPrediction = predictions[0];
  const recs = topPrediction?.recommendation;

  return (
    <div className="container">
      <h1 className="mainTitle">Health Analysis Report</h1>

      {/* 1. PRIMARY ASSESSMENT (The New Look) */}
      <div className="card">
        <h2 className="sectionTitle">Primary Assessment</h2>
        <div className="predictionBox">
          <div className="diseaseName">{topPrediction.disease}</div>
          <div className="confidence">Model Confidence: {topPrediction.confidence}</div>
          <div className="statusBadge">Status: High (Clinical Urgent)</div>
        </div>

        <div className="actionPlanHeader">📋 Clinical Action Plan</div>
        <div className="grid">
          <div className="infoBox">
            <div className="boxTitle">🥗 Suggested Diet</div>
            <div className="boxContent">{recs?.diet || "Not specified."}</div>
          </div>
          <div className="infoBox">
            <div className="boxTitle">🧘 Lifestyle Changes</div>
            <div className="boxContent">{recs?.lifestyle || "Not specified."}</div>
          </div>
        </div>

        {recs?.precautions && (
          <div className="precautionBox">
            <div className="precautionTitle">⚠️ Important Precautions</div>
            <div className="precautionText">{recs.precautions}</div>
          </div>
        )}
      </div>

      {/* 2. INPUT SUMMARY & SYMPTOMS */}
      <div className="card">
        <h2 className="sectionTitle">Patient Input Summary</h2>
        <div className="gridThreeCols">
          <div><strong>Age:</strong> {userData?.age || "N/A"}</div>
          <div><strong>BP:</strong> {userData?.bp || "N/A"}</div>
          {userData?.temperature && <div><strong>Temp:</strong> {userData?.temperature}°F</div>}
        </div>

        {predictionType === "symptoms" && symptoms?.length > 0 && (
          <div className="symptomMargin">
            <strong className="symptomLabel">Reported Symptoms:</strong>
            {symptoms.map((s, i) => (
              <span key={i} className="badge">{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* 3. BLOOD REPORT DATA (Dynamic Table) */}
      {predictionType === "report" && reportData && (
        <div className="card">
          <h2 className="sectionTitle">Detailed Blood Parameters</h2>
          <div className="scrollableTable">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Parameter</th>
                  <th className="th">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(reportData).map(([key, value]) => (
                  <tr key={key}>
                    <td className="td">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</td>
                    <td className="tdBold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DIFFERENTIAL DIAGNOSIS (Other Possibilities) */}
      {predictions.length > 1 && (
        <div className="card">
          <h2 className="sectionTitle">Differential Diagnosis (Secondary)</h2>
          {predictions.slice(1).map((p, i) => (
            <div key={i} className="differentialDiagnosisRow">
              <span className="diseaseLabel">{p.disease}</span>
              <span className="confidenceLabel">{p.confidence} Match</span>
            </div>
          ))}
        </div>
      )}

      <button className="navBtn" onClick={() => navigate("/health-form")}>
        Perform New Analysis
      </button>

      <p className="disclaimer">
        *Disclaimer: This AI assessment is for informational purposes only and does not replace professional medical advice.
      </p>
    </div>
  );
};

export default Result;
