# 🏥 Real-Time Disease Prediction & Smart Health Monitoring System

[![GitHub stars](https://img.shields.io/github/stars/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System?style=social)](https://github.com/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System/stargazers)
[![GitHub license](https://img.shields.io/github/license/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System)](https://github.com/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System/blob/main/LICENSE)
[![Render](https://img.shields.io/badge/deployed%20on-Render-46E3B7.svg)](https://real-time-disease-prediction-and-smart.onrender.com)

A full-stack web application that uses machine learning to predict potential diseases based on user symptoms. The system features a React frontend, Node.js backend, and a Python Flask ML service.

![Dashboard Screenshot](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

## ✨ Features

### 🔬 ML-Powered Disease Prediction
- Real-time disease prediction based on selected symptoms
- Trained ML model with 132+ symptoms and multiple disease classifications
- Top 3 most probable diseases with confidence percentages
- Color-coded confidence levels (High/Medium/Low)

### 🏥 Smart Health Monitoring
- Track vital signs (age, temperature, blood pressure)
- Personal health dashboard with analytics
- Prediction history with detailed records
- Visual charts and trends analysis

### 🤖 AI Chatbot Assistant
- Integrated Gemini AI for health-related queries
- Rate-limited to prevent abuse
- Provides general health information and guidance

### 🔐 User Management
- Secure JWT authentication
- Protected routes for authorized users
- Personalized dashboard for each user

### 📊 Analytics Dashboard
- Overview statistics (total predictions, unique conditions)
- Disease frequency distribution charts
- Confidence trends over time
- Recent activity feed

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Framer Motion** for animations
- **Recharts** for data visualization
- **TailwindCSS** for styling
- **React Router DOM** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection
- **CORS** enabled

### Machine Learning
- **Python Flask** API
- **Scikit-learn** trained model
- **Joblib** for model serialization
- **NumPy** for numerical operations
- **Flask-CORS** for cross-origin requests

### AI Integration
- **Google Gemini AI** for chatbot
- **Rate limiting** for API protection

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System.git
cd Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**.env configuration:**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthdb
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
```

### 4. ML Model Setup
```bash
cd ../ml-model/symptons

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 🏃 Running the Application

### Terminal 1 - ML Service
```bash
cd ml-model/symptons
venv\Scripts\activate  # Windows
# or source venv/bin/activate  # Mac/Linux
python app.py
# Runs on http://localhost:5000
```

### Terminal 2 - Backend Server
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### Terminal 3 - Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## 🌐 Deployment

### Deploy on Render
The application is configured for easy deployment on Render:

1. **Push code to GitHub**
2. **Create a new Web Service** on Render
3. **Connect your GitHub repository**
4. **Set environment variables** in Render Dashboard
5. **Deploy!**

**Live Demo:** [https://real-time-disease-prediction-and-smart.onrender.com](https://real-time-disease-prediction-and-smart.onrender.com)

## 📁 Project Structure

```
Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/         # Auth middleware
│   └── package.json
│
├── ml-model/               # Python ML Service
│   └── symptons/
│       ├── app.py         # Flask application
│       ├── model/          # Trained ML model
│       └── requirements.txt
│
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### ML Predictions
- `GET /api/ml/health` - Check ML service status
- `GET /api/ml/symptoms` - Get all symptoms (protected)
- `POST /api/ml/predict` - Make disease prediction (protected)

### Health Records
- `POST /api/predict/symptoms` - Save prediction (protected)
- `GET /api/predict/history` - Get user history (protected)
- `GET /api/predict/:id` - Get specific record (protected)
- `DELETE /api/predict/:id` - Delete record (protected)

### Chatbot
- `POST /api/chat` - Send message to AI (protected, rate-limited)

## 🧪 Testing

### Test ML Service Directly
```bash
# Health check
curl http://localhost:5000/health

# Make prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough", "fatigue"]}'
```

### Test Backend API
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get symptoms (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/ml/symptoms
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shoaib Ahamad** - *Initial work* - [Shoaib-ahamad](https://github.com/Shoaib-ahamad)
- **Sheikh Bilal** - *Contributor* - [QuantumCoder-001](https://github.com/QuantumCoder-001)

## 🙏 Acknowledgments

- Google Gemini AI for chatbot capabilities
- Scikit-learn for machine learning models
- MongoDB Atlas for database hosting
- Render for cloud deployment

## 📞 Contact

- **Project Link**: [https://github.com/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System](https://github.com/Shoaib-ahamad/Real-Time-Disease-Prediction-and-Smart-Health-Monitoring-System)
- **Live Demo**: [https://real-time-disease-prediction-and-smart.onrender.com](https://real-time-disease-prediction-and-smart.onrender.com)

---

**⭐ Don't forget to star the project if you find it useful!**