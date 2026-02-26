const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptoms: [{
    type: String,
    required: true,
  }],
  age: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  bp: {
    type: String,
  },
  predictions: [{
    disease: String,
    confidence: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);