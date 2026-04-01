const HealthRecord = require("../models/HealthRecord");
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// 1. Health check (Checks if ML service is awake)
const checkHealth = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 60000 });
    res.json(response.data);
  } catch (error) {
    console.error("Health Check Proxy Failed:", error.message);
    res.status(503).json({ status: "offline" });
  }
};

// 2. Predict symptoms
const predictSymptoms = async (req, res) => {
  try {
    const { symptoms, age, temperature, bp } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "At least one symptom is required" });
    }

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, { symptoms }, { timeout: 60000 });
    const predictions = mlResponse.data;

    // The 'predictions' object now contains the 'precautions' from app.py
    await HealthRecord.create({
      user: req.user._id,
      symptoms,
      age,
      temperature,
      bp,
      predictions,
      predictionType: "symptoms",
      createdAt: new Date()
    });

    res.status(201).json({ success: true, predictions });

  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    res.status(500).json({ success: false, message: "ML service is unavailable" });
  }
};

// 3. Predict report
const predictReport = async (req, res) => {
  try {
    const { report_data, age, bp } = req.body;

    if (!report_data) {
      return res.status(400).json({ message: "Blood report data is required" });
    }

    // Explicitly convert values to numbers before sending to ML service
    // This prevents the 400 error caused by string inputs
    const payload = {};
    for (const key in report_data) {
      payload[key] = parseFloat(report_data[key]) || 0;
    }

    // Add age and bp to the flat payload for the ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-report`, {
      ...payload,
      age: parseFloat(age) || 0,
      bp: bp // BP is usually handled as a string "120/80"
    }, { timeout: 60000 });

    const predictions = mlResponse.data;

    // Save to database
    await HealthRecord.create({
      user: req.user._id,
      age,
      bp,
      reportData: payload,
      predictions,
      predictionType: "blood_report",
      createdAt: new Date()
    });

    res.status(201).json({ success: true, predictions });

  } catch (error) {
    console.error("ML Report Prediction Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.error || "Report prediction failed"
    });
  }
};

// 4. Get symptoms list
const getSymptomsList = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/symptoms`, { timeout: 60000 });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch symptoms:", error.message);
    res.status(500).json({ message: "Could not load symptoms" });
  }
};

// 5. History and Records
const getHistory = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(records);
  } catch {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

const getRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkHealth,
  predictSymptoms,
  predictReport,
  getSymptomsList,
  getHistory,
  getRecord,
  deleteRecord
};
