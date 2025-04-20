import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchUserEmail = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const email = response.data.email;
      console.log("User email:", email);
      setUserEmail(email);
      localStorage.setItem("email", email); // Store email in localStorage if needed
    } catch (err) {
      console.error("Error fetching user email:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchUserEmail(); // Fetch the email if authenticated
    }
    setIsAuthChecked(true); // Set auth check as completed
  }, [auth?.isAuthenticated]);

  if (!isAuthChecked) {
    return <div className="text-white">Checking authentication...</div>;
  }

  if (!auth?.isAuthenticated) {
    console.warn("🔴 Redirecting to login because user is not authenticated");
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white bg-gradient-to-t from-blue-600 to-blue-200 min-h-screen">
      <div className="w-full fixed top-0 z-50 text-white bg-[#1b2024] flex items-center justify-between p-4">
        <h1>Logo</h1>
        <h2 className="text-2xl font-bold">
          Welcome back, {userEmail ? userEmail : "User"}
        </h2>
        <div>
          <button
            onClick={auth.logout}
            className="mt-4 !bg-red-500 !border-0 text-white p-2 !rounded-lg !font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
