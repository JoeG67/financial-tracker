import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [budgetData, setBudgetData] = useState<any>(null); // ← Step 2: state for budget data

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
      localStorage.setItem("email", email);
    } catch (err) {
      console.error("Error fetching user email:", err.response?.data?.message || err.message);
    }
  };


  useEffect(() => {
    const fetchBudgetData = async (email: string) => {
      console.log("Fetching budget data for:", email);

      try {
        const response = await axios.get(`http://localhost:5000/api/user-budget/${email}`);
        setBudgetData(response.data);
      } catch (err) {
        console.error("Failed to fetch budget data", err);
      }
    };

    
    if (auth?.isAuthenticated) {
      fetchUserEmail().then(() => {
        const email = localStorage.getItem("email");
        if (email) fetchBudgetData(email); // ← Step 2: fetch budget
      });
    }
    setIsAuthChecked(true);
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
      <div className="w-full fixed top-0 z-50 text-white bg-[#1b2024] flex items-center justify-between p-4 text-xl">
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

      {budgetData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mt-24">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              Your current balance is <span className="text-green-500">RM{budgetData.initial_balance}</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              You've allocated <span className="text-green-500">RM{budgetData.phone_bill}</span> for your phone bill this month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              You've spent <span className="text-green-500">RM{budgetData.transportation}</span> on transportation this month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              You've spent <span className="text-green-500">RM{budgetData.groceries}</span> on groceries this month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              You've set aside <span className="text-green-500">RM{budgetData.entertainment}</span> for entertainment this month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xl">
              You've set aside    <span className="text-green-500">
      RM
      {budgetData.initial_balance -
        (budgetData.phone_bill +
         budgetData.transportation +
         budgetData.utilities +
         budgetData.entertainment)}
    </span> for emergency savings this month
            </p>
          </div>
        </div>
      ) : (
        <div className="text-lg mt-24 text-gray-700">Loading budget data...</div>
      )}
    </div>
  );
};

export default Dashboard;
