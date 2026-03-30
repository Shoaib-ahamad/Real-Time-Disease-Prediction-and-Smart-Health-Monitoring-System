import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Loginpage";
import Register from "./pages/Register/Registerpage";
import Dashboard from "./pages/Dashboard/Dashboardpage";
import HealthForm from "./pages/HealthForm/HealthFormpage";
import Result from "./pages/Result/Resultpage";
import History from "./pages/History/Historypage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ForgotPassword from "./pages/Forgetpassword/Forgetpasswordpage";
import ResetPassword from "./pages/ResetPassword/ResetPasswordpage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/health-form"
          element={
            <ProtectedRoute>
              <Layout>
                <HealthForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Layout>
                <Result />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;