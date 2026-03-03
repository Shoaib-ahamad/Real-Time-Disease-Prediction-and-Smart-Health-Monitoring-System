import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { predictions, symptoms, userData } = location.state || { 
    predictions: [], 
    symptoms: [],
    userData: null 
  };

  if (!predictions || predictions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>No Prediction Available</h2>
          <p style={styles.errorMessage}>
            We couldn't find any prediction data. Please try submitting the form again.
          </p>
          <button 
            onClick={() => navigate("/health-form")} 
            style={styles.primaryButton}
          >
            Go to Health Form
          </button>
        </div>
      </div>
    );
  }

  /*const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await API.post("/ml-model/symptons", {
        symptoms,
        predictions,
        userData,
        date: new Date().toISOString()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save to history:", error);
    } finally {
      setSaving(false);
    }
  };*/

  const handleSaveToHistory = async () => {
  setSaving(true);
  try {
    // Prepare the data in the format your backend expects
    const saveData = {
      symptoms: symptoms,
      age: userData?.age,
      temperature: userData?.temperature,
      bp: userData?.bp,
      predictions: predictions.map(p => ({
        disease: p.disease,
        confidence: p.confidence,
        confidence_level: p.confidence_level || 
          (parseFloat(p.confidence) >= 70 ? "High" : 
           parseFloat(p.confidence) >= 40 ? "Medium" : "Low")
      }))
    };

    console.log('📤 Saving to history:', saveData);
    console.log('📍 Using API base URL:', API.defaults.baseURL);

    // Make sure we're using the full URL with /api prefix
    const response = await API.post('/predict/symptoms', saveData);
    
    console.log('✅ Save response:', response.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (error) {
    console.error("❌ Failed to save to history:", error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('URL that was called:', error.config?.url);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
      alert(error.response.data.message || "Failed to save to history");
    } else if (error.request) {
      console.error('No response received');
      alert("Cannot connect to server. Please check if backend is running.");
    } else {
      console.error('Error:', error.message);
      alert("An unexpected error occurred");
    }
  } finally {
    setSaving(false);
  }
};
  const getConfidenceColor = (confidence) => {
    const num = parseFloat(confidence);
    if (num >= 70) return styles.highConfidence;
    if (num >= 40) return styles.mediumConfidence;
    return styles.lowConfidence;
  };

  const getConfidenceText = (confidence) => {
    const num = parseFloat(confidence);
    if (num >= 70) return "High Probability";
    if (num >= 40) return "Medium Probability";
    return "Low Probability";
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
    date: {
      color: "#6c757d",
      fontSize: "14px"
    },
    summaryCard: {
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "30px",
      border: "1px solid #e9ecef"
    },
    summaryTitle: {
      fontSize: "18px",
      color: "#495057",
      marginTop: 0,
      marginBottom: "15px"
    },
    symptomsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px"
    },
    symptomTag: {
      backgroundColor: "#e7f3ff",
      color: "#0066cc",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500"
    },
    userDataGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginTop: "15px",
      padding: "15px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #dee2e6"
    },
    userDataItem: {
      display: "flex",
      flexDirection: "column" 
    },
    userDataLabel: {
      fontSize: "12px",
      color: "#6c757d",
      marginBottom: "4px"
    },
    userDataValue: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333"
    },
    predictionsList: {
      marginBottom: "30px"
    },
    predictionCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e9ecef",
      transition: "transform 0.2s, box-shadow 0.2s"
    },
    predictionHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px"
    },
    rankBadge: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#007bff",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "18px",
      marginRight: "15px"
    },
    diseaseName: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#333",
      margin: 0,
      flex: 1
    },
    confidenceContainer: {
      marginBottom: "10px"
    },
    confidenceLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px",
      fontSize: "14px",
      color: "#6c757d"
    },
    confidenceBar: {
      width: "100%",
      height: "24px",
      backgroundColor: "#e9ecef",
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative"
    },
    confidenceFill: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: "10px",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
      transition: "width 0.3s ease"
    },
    confidenceText: {
      marginTop: "5px",
      fontSize: "13px",
      fontWeight: "500"
    },
    highConfidence: {
      backgroundColor: "#28a745"
    },
    mediumConfidence: {
      backgroundColor: "#ffc107",
      color: "#333"
    },
    lowConfidence: {
      backgroundColor: "#dc3545"
    },
    disclaimerCard: {
      backgroundColor: "#fff3cd",
      border: "1px solid #ffeeba",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "30px"
    },
    disclaimerTitle: {
      color: "#856404",
      fontSize: "16px",
      fontWeight: "600",
      marginTop: 0,
      marginBottom: "10px"
    },
    disclaimerText: {
      color: "#856404",
      fontSize: "14px",
      margin: 0,
      lineHeight: "1.6"
    },
    actionButtons: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      flexWrap: "wrap"
    },
    primaryButton: {
      padding: "12px 30px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    secondaryButton: {
      padding: "12px 30px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    saveButton: {
      padding: "12px 30px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    savedMessage: {
      textAlign: "center",
      color: "#28a745",
      marginTop: "10px",
      fontSize: "14px"
    },
    errorCard: {
      textAlign: "center",
      padding: "40px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      border: "1px solid #dee2e6"
    },
    errorTitle: {
      color: "#dc3545",
      marginBottom: "15px"
    },
    errorMessage: {
      color: "#6c757d",
      marginBottom: "20px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Prediction Results</h1>
        <span style={styles.date}>{formatDate()}</span>
      </div>

      {/* Summary Section */}
      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Analysis Summary</h3>
        
        {/* Symptoms */}
        <div style={styles.symptomsContainer}>
          {symptoms.map((symptom, index) => (
            <span key={index} style={styles.symptomTag}>
              {symptom}
            </span>
          ))}
        </div>

        {/* User Data */}
        {userData && (
          <div style={styles.userDataGrid}>
            <div style={styles.userDataItem}>
              <span style={styles.userDataLabel}>Age</span>
              <span style={styles.userDataValue}>{userData.age} years</span>
            </div>
            <div style={styles.userDataItem}>
              <span style={styles.userDataLabel}>Temperature</span>
              <span style={styles.userDataValue}>{userData.temperature}°F</span>
            </div>
            <div style={styles.userDataItem}>
              <span style={styles.userDataLabel}>Blood Pressure</span>
              <span style={styles.userDataValue}>{userData.bp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Predictions List */}
      <div style={styles.predictionsList}>
        <h3 style={styles.summaryTitle}>Top Possible Conditions</h3>
        {predictions.map((pred, index) => (
          <div 
            key={index} 
            style={styles.predictionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={styles.predictionHeader}>
              <span style={styles.rankBadge}>#{index + 1}</span>
              <h4 style={styles.diseaseName}>{pred.disease}</h4>
            </div>

            <div style={styles.confidenceContainer}>
              <div style={styles.confidenceLabel}>
                <span>Confidence Level</span>
                <span style={{ fontWeight: "bold" }}>{pred.confidence}</span>
              </div>
              <div style={styles.confidenceBar}>
                <div 
                  style={{
                    ...styles.confidenceFill,
                    ...getConfidenceColor(pred.confidence),
                    width: pred.confidence
                  }}
                >
                  {parseFloat(pred.confidence) >= 60 && pred.confidence}
                </div>
              </div>
              <div style={styles.confidenceText}>
                {getConfidenceText(pred.confidence)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Medical Disclaimer */}
      <div style={styles.disclaimerCard}>
        <h4 style={styles.disclaimerTitle}>⚠️ Important Medical Disclaimer</h4>
        <p style={styles.disclaimerText}>
          This prediction is generated by an AI model and should not be considered 
          as professional medical advice. The results are for informational purposes 
          only. Always consult with a qualified healthcare provider for proper 
          diagnosis and treatment.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button 
          onClick={handleSaveToHistory}
          style={styles.saveButton}
          disabled={saving || saved}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save to History"}
        </button>
        
        <button 
          onClick={() => navigate("/health-form")} 
          style={styles.primaryButton}
        >
          New Prediction
        </button>
        
        <button 
          onClick={() => navigate("/dashboard")} 
          style={styles.secondaryButton}
        >
          Back to Dashboard
        </button>
      </div>

      {saved && (
        <div style={styles.savedMessage}>
          ✓ Successfully saved to your history!
        </div>
      )}
    </div>
  );
};

export default Result;