import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext"; // Ensure you're wrapping in AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Use key to force Router updates */}
        <Routes key={localStorage.getItem("token")}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
