const HealthRecord = require("../models/HealthRecord");
const axios = require("axios");

// Local ML service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// Predict symptoms using local ML model
exports.predictSymptoms = async (req, res) => {
  try {
    const { symptoms, age, temperature, bp } = req.body;

    // Validate symptoms
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        message: "At least one symptom is required",
      });
    }

    console.log("Calling local ML service with symptoms:", symptoms);

    // Call local ML API
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      symptoms: symptoms
    });

    console.log("ML Response:", mlResponse.data);

    // Format the response (mlResponse.data is already an array of predictions)
    const predictions = mlResponse.data;

    // Save to DB with all predictions
    const record = await HealthRecord.create({
      user: req.user._id,
      symptoms,
      age,
      temperature,
      bp,
      predictions, // Store all predictions
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      predictions: predictions
    });

  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        success: false,
        message: "ML service is not running. Please start the Flask app."
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Prediction failed"
      });
    }
  }
};

// Get user's prediction history
exports.getHistory = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(records);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch history" 
    });
  }
};

// Get single prediction record
exports.getRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await HealthRecord.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    
    res.json(record);
  } catch (error) {
    console.error("Get record error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete prediction record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await HealthRecord.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};