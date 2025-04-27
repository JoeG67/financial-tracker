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
      console.error(
        "Error fetching user email:",
        err.response?.data?.message || err.message
      );
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
    <div className="flex flex-col items-center justify-center p-6 text-black bg-blue-100 min-h-screen">
      <div className="w-full fixed top-0 z-50 text-white bg-[#1b2024] flex items-center justify-between p-4">
        <img
          src="https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-dashboard-glyph-black-icon-png-image_691533.jpg"
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
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
      <div className = "flex flex-row justify-between gap-2  ">
      <div className="bg-white rounded-lg ">
        {" "}
        <p className="p-4">
          Your current balance is{" "}
          <span className="text-green-500">RM5000. </span>{" "}
        </p>
      </div>
      <div className="bg-white rounded-lg ">
        {" "}
        <p className="p-4">
          Your current balance is{" "}
          <span className="text-green-500">RM5000. </span>{" "}
        </p>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
