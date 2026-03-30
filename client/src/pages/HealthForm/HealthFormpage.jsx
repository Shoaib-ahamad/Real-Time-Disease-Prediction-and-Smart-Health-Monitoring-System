import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getSymptoms, predictDisease, predictByReport, checkMLHealth } from "../../services/api";

const HealthForm = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("symptoms");

  const [formData, setFormData] = useState({
    age: "",
    temperature: "",
    bp: "",
  });

  const [reportData, setReportData] = useState({
    glucose: "", cholesterol: "", hemoglobin: "", platelets: "",
    wbc: "", rbc: "", hematocrit: "", mcv: "", mch: "", mchc: "",
    insulin: "", bmi: "", systolic: "", diastolic: "", triglycerides: "",
    hba1c: "", ldl: "", hdl: "", alt: "", ast: "", heartRate: "",
    creatinine: "", troponin: "", crp: ""
  });

  const [symptomsList, setSymptomsList] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mlStatus, setMlStatus] = useState("checking");
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  useEffect(() => {
    checkMLHealthStatus();
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (symptomsList.length > 0) {
      if (searchTerm.trim() === "") {
        setFilteredSymptoms(symptomsList.slice(0, 50));
      } else {
        const filtered = symptomsList.filter(symptom =>
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSymptoms(filtered);
      }
    }
  }, [searchTerm, symptomsList]);

  const checkMLHealthStatus = async () => {
    try {
      const status = await checkMLHealth();
      if (status.status === "healthy" || status.status === "online") {
        setMlStatus("online");
      } else {
        setMlStatus("offline");
      }
    } catch (err) {
      console.error("ML health check failed:", err.message);
      setMlStatus("offline");
    }
  };

  const loadSymptoms = async () => {
    setLoadingSymptoms(true);
    try {
      const response = await getSymptoms();
      // Supports both { symptoms: [] } and raw array []
      const list = response.symptoms || (Array.isArray(response) ? response : null);

      if (list) {
        setSymptomsList(list);
        setFilteredSymptoms(list.slice(0, 50));
      } else {
        setError("Invalid symptoms data format.");
      }
    } catch (err) {
      console.error("Failed to load symptoms:", err.message);
      setError("Failed to load symptoms list.");
    } finally {
      setLoadingSymptoms(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReportChange = (e) => {
    setReportData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (activeForm === "symptoms") {
        if (selectedSymptoms.length === 0) throw new Error("Select at least one symptom");
        result = await predictDisease(selectedSymptoms, formData);
      } else {
        // Corrected: Passing reportData directly
        result = await predictByReport(reportData, formData);
      }

      navigate("/result", {
        state: {
          predictions: result.predictions || (result.data ? result.data.predictions : []),
          symptoms: activeForm === "symptoms" ? selectedSymptoms : [],
          reportData: activeForm === "report" ? reportData : null,
          predictionType: activeForm,
          userData: formData
        }
      });
    } catch (err) {
      console.error("Prediction Error:", err);
      setError(err.response?.data?.message || err.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: "700px", margin: "20px auto", padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "22px", color: "#1e293b", fontWeight: "700" },
    toggleContainer: { display: "flex", backgroundColor: "#f1f5f9", borderRadius: "25px", padding: "5px", marginBottom: "25px" },
    toggleBtn: { flex: 1, padding: "12px", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "600", transition: "0.3s" },
    activeToggle: { backgroundColor: "#4f46e5", color: "#ffffff" },
    inactiveToggle: { backgroundColor: "transparent", color: "#64748b" },
    gridContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
    formGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" },
    input: { width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", boxSizing: "border-box", color: "#1e293b", backgroundColor: "#f8fafc" },
    symptomsContainer: { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px", maxHeight: "250px", overflowY: "auto", backgroundColor: "#ffffff" },
    symptomsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    symptomBtn: { padding: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", borderRadius: "6px", cursor: "pointer", fontSize: "13px", textAlign: "left", color: "#475569", transition: "0.2s" },
    symptomBtnSelected: { backgroundColor: "#4f46e5", color: "#ffffff", borderColor: "#4f46e5" },
    button: { width: "100%", padding: "16px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "20px", transition: "0.2s" },
    error: { color: "#b91c1c", backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px", marginTop: "15px", border: "1px solid #fee2e2" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Health Analysis</h2>
        <div style={{fontSize: '14px', fontWeight: '600', color: mlStatus === "online" ? "#10b981" : "#ef4444"}}>
            {mlStatus === "online" ? "🟢 ML Service Online" : "🔴 ML Service Offline"}
        </div>
      </div>

      <div style={styles.toggleContainer}>
        <button
          type="button"
          style={{...styles.toggleBtn, ...(activeForm === "symptoms" ? styles.activeToggle : styles.inactiveToggle)}}
          onClick={() => setActiveForm("symptoms")}
        >
          Symptom Analysis
        </button>
        <button
          type="button"
          style={{...styles.toggleBtn, ...(activeForm === "report" ? styles.activeToggle : styles.inactiveToggle)}}
          onClick={() => setActiveForm("report")}
        >
          Blood Report
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.gridContainer}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Patient Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required style={styles.input} placeholder="e.g. 25" />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Blood Pressure</label>
                <input type="text" name="bp" placeholder="120/80" value={formData.bp} onChange={handleChange} required style={styles.input} />
            </div>
        </div>

        {activeForm === "symptoms" && (
          <div className="slide-in">
             <div style={styles.formGroup}>
                <label style={styles.label}>Body Temperature (°F)</label>
                <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required step="0.1" style={styles.input} placeholder="98.6" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Symptoms ({selectedSymptoms.length} selected)</label>
              <input
                type="text"
                placeholder="🔍 Search symptoms (e.g. fever, headache)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{...styles.input, marginBottom: '15px'}}
              />
              <div style={styles.symptomsContainer}>
                {loadingSymptoms ? (
                  <p style={{textAlign: 'center', color: '#64748b'}}>Loading symptoms list...</p>
                ) : (
                  <div style={styles.symptomsGrid}>
                    {filteredSymptoms.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSymptom(s)}
                        style={{...styles.symptomBtn, ...(selectedSymptoms.includes(s) ? styles.symptomBtnSelected : {})}}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeForm === "report" && (
          <div style={{...styles.gridContainer, maxHeight: '400px', overflowY: 'auto', paddingRight: '10px'}}>
            {Object.keys(reportData).map((key) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="number"
                  step="0.01"
                  name={key}
                  value={reportData[key]}
                  onChange={handleReportChange}
                  style={styles.input}
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={styles.button} disabled={loading || mlStatus === "offline"}>
          {loading ? "Analyzing Data..." : "Generate Diagnosis Report"}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default HealthForm;
