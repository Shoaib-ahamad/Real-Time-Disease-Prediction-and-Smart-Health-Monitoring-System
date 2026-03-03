import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getSymptoms, predictDisease, checkMLHealth } from "../services/api";

const HealthForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    temperature: "",
    bp: "",
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
    // Filter symptoms based on search term
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
      setMlStatus(status.status);
    } catch (err) {
      console.error("Health check failed:", err);
      setMlStatus("offline");
    }
  };

  const loadSymptoms = async () => {
    setLoadingSymptoms(true);
    setError("");
    try {
      console.log("Fetching symptoms...");
      const response = await getSymptoms();
      console.log("Symptoms response:", response);
      
      if (response && response.symptoms) {
        setSymptomsList(response.symptoms);
        setFilteredSymptoms(response.symptoms.slice(0, 50));
      } else {
        setError("No symptoms data received");
      }
    } catch (err) {
      console.error("Failed to load symptoms:", err);
      setError("Failed to load symptoms list. Please refresh the page.");
    } finally {
      setLoadingSymptoms(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

 /* const handleSubmit = async (e) => {


    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form data
      if (selectedSymptoms.length === 0) {
        throw new Error("Please select at least one symptom");
      }

      if (!formData.age || formData.age < 0 || formData.age > 150) {
        throw new Error("Please enter a valid age (0-150)");
      }

      if (!formData.temperature || formData.temperature < 90 || formData.temperature > 110) {
        throw new Error("Please enter a valid temperature (90-110°F)");
      }

      if (!formData.bp || !formData.bp.match(/^\d{2,3}\/\d{2,3}$/)) {
        throw new Error("Please enter blood pressure in format: 120/80");
      }

      // Make prediction
      const result = await predictDisease(selectedSymptoms);

      // Navigate to result page
      navigate("/result", { 
        state: { 
          predictions: result.predictions,
          symptoms: selectedSymptoms,
          userData: {
            age: formData.age,
            temperature: formData.temperature,
            bp: formData.bp
          }
        } 
      });

    } catch (err) {
      console.error("Prediction Error:", err);
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        // Validate form data
        if (selectedSymptoms.length === 0) {
            throw new Error("Please select at least one symptom");
        }

        if (!formData.age || formData.age < 0 || formData.age > 150) {
            throw new Error("Please enter a valid age (0-150)");
        }

        if (!formData.temperature || formData.temperature < 90 || formData.temperature > 110) {
            throw new Error("Please enter a valid temperature (90-110°F)");
        }

        if (!formData.bp || !formData.bp.match(/^\d{2,3}\/\d{2,3}$/)) {
            throw new Error("Please enter blood pressure in format: 120/80");
        }

        console.log("Making prediction with:", {
            symptoms: selectedSymptoms,
            userData: formData
        });

        // Make prediction using the correct endpoint
        const result = await predictDisease(selectedSymptoms, formData);
        
        console.log("Prediction result:", result);

        // Navigate to result page
        navigate("/result", { 
            state: { 
                predictions: result.predictions,
                symptoms: selectedSymptoms,
                userData: {
                    age: formData.age,
                    temperature: formData.temperature,
                    bp: formData.bp
                }
            } 
        });

    } catch (err) {
        console.error("Prediction Error:", err);
        setError(err.response?.data?.message || err.message || "Prediction failed. Please try again.");
    } finally {
        setLoading(false);
    }
};

  // Styles with fixed text colors
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333333",
      margin: 0
    },
    mlStatus: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500"
    },
    statusOnline: {
      backgroundColor: "#d4edda",
      color: "#155724"
    },
    statusOffline: {
      backgroundColor: "#f8d7da",
      color: "#721c24"
    },
    statusChecking: {
      backgroundColor: "#e2e3e5",
      color: "#383d41"
    },
    warningMessage: {
      backgroundColor: "#fff3cd",
      border: "1px solid #ffeeba",
      color: "#856404",
      padding: "12px",
      borderRadius: "4px",
      marginBottom: "20px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
      color: "#495057"
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ced4da",
      borderRadius: "4px",
      fontSize: "16px",
      color: "#333333", // Dark text
      backgroundColor: "#ffffff",
      boxSizing: "border-box"
    },
    searchBox: {
      marginBottom: "15px"
    },
    symptomsContainer: {
      border: "1px solid #ced4da",
      borderRadius: "4px",
      padding: "15px",
      maxHeight: "300px",
      overflowY: "auto",
      backgroundColor: "#ffffff"
    },
    symptomsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "8px"
    },
    symptomBtn: {
      padding: "8px 12px",
      border: "1px solid #ced4da",
      backgroundColor: "#ffffff",
      color: "#333333", // Dark text
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.2s",
      textAlign: "left"
    },
    symptomBtnSelected: {
      backgroundColor: "#007bff",
      color: "#ffffff", // White text when selected
      borderColor: "#0056b3"
    },
    selectedCount: {
      marginTop: "10px",
      fontSize: "14px",
      color: "#6c757d"
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed"
    },
    error: {
      color: "#dc3545",
      marginTop: "10px",
      padding: "10px",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "4px"
    },
    loading: {
      textAlign: "center",
      color: "#007bff",
      marginTop: "10px"
    },
    loadingSymptoms: {
      textAlign: "center",
      padding: "20px",
      color: "#6c757d"
    }
  };

  const getStatusStyle = () => {
    if (mlStatus === "online") return styles.statusOnline;
    if (mlStatus === "offline") return styles.statusOffline;
    return styles.statusChecking;
  };

  const getStatusText = () => {
    if (mlStatus === "online") return "🟢 ML Service Online";
    if (mlStatus === "offline") return "🔴 ML Service Offline";
    return "⚪ Checking ML Service...";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Health Prediction Form</h2>
        <div style={{...styles.mlStatus, ...getStatusStyle()}}>
          {getStatusText()}
        </div>
      </div>

      {mlStatus === "offline" && (
        <div style={styles.warningMessage}>
          ⚠️ ML service is offline. Please ensure the Python Flask app is running on port 5000.
          <br />
          <small>Run: cd ml-model/symptons & python app.py</small>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            max="150"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Temperature (°F)</label>
          <input
            type="number"
            name="temperature"
            placeholder="Enter temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            min="90"
            max="110"
            step="0.1"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Blood Pressure</label>
          <input
            type="text"
            name="bp"
            placeholder="e.g., 120/80"
            value={formData.bp}
            onChange={handleChange}
            required
            pattern="\d{2,3}\/\d{2,3}"
            style={styles.input}
          />
          <small style={{color: "#6c757d"}}>Format: systolic/diastolic (e.g., 120/80)</small>
        </div>

        {/* Symptoms Selection Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Your Symptoms</label>
          
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
              disabled={loadingSymptoms}
            />
          </div>

          {loadingSymptoms ? (
            <div style={styles.loadingSymptoms}>
              Loading symptoms list...
            </div>
          ) : symptomsList.length === 0 ? (
            <div style={styles.error}>
              No symptoms loaded. 
              <button 
                onClick={loadSymptoms} 
                style={{ marginLeft: "10px", padding: "5px 10px" }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div style={styles.symptomsContainer}>
                <div style={styles.symptomsGrid}>
                  {filteredSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      style={{
                        ...styles.symptomBtn,
                        ...(selectedSymptoms.includes(symptom) ? styles.symptomBtnSelected : {})
                      }}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.selectedCount}>
                Selected: {selectedSymptoms.length} symptoms
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || selectedSymptoms.length === 0 || mlStatus === "offline"}
          style={{
            ...styles.button,
            ...((loading || selectedSymptoms.length === 0 || mlStatus === "offline") ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "Analyzing..." : "Predict Disease"}
        </button>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default HealthForm;