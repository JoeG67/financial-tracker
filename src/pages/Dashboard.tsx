import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [editedBudget, setEditedBudget] = useState<any>(null);

  const fetchUserEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Authentication token not found locally");

    try {
      const response = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const email = response.data.email;
      setUserEmail(email);
      localStorage.setItem("email", email);
    } catch (err) {
      console.error("Error fetching user email:", err.response?.data?.message || err.message);
    }
  };

  const fetchBudgetData = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user-budget/${email}`);
      setBudgetData(response.data);
      setEditedBudget(response.data); // allow editing
    } catch (err) {
      console.error("Failed to fetch budget data", err);
    }
  };

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchUserEmail().then(() => {
        const email = localStorage.getItem("email");
        if (email) fetchBudgetData(email);
      });
    }
    setIsAuthChecked(true);
  }, [auth?.isAuthenticated]);

  const handleChange = (field: string, value: number) => {
    setEditedBudget((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userEmail) return;

    try {
      await axios.put(`http://localhost:5000/api/user-budget/${userEmail}`, editedBudget);
      setBudgetData(editedBudget);
      alert("Budget updated successfully!");
    } catch (err) {
      console.error("Failed to update budget", err);
      alert("Failed to save changes.");
    }
  };

  if (!isAuthChecked) return <div className="text-white">Checking authentication...</div>;

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
        <h2 className="text-2xl font-bold">Welcome back, {userEmail || "User"}</h2>
        <div>
          <button
            onClick={auth.logout}
            className=" !bg-red-500 !border-0 text-white p-2 !rounded-lg !font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {budgetData && editedBudget ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mt-24">
            {["initial_balance", "phone_bill", "transportation", "utilities", "entertainment"].map((field) => (
              <div key={field} className="bg-white rounded-lg shadow p-4">
                <label className="block text-xl capitalize mb-2">
                  {field.replace("_", " ")}:
                </label>
                <input
                  type="number"
                  value={editedBudget[field]}
                  onChange={(e) => handleChange(field, Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xl">
                Your remaining balance is{" "}
                <span className="text-green-500">
                  RM
                  {editedBudget.initial_balance -
                    (editedBudget.phone_bill +
                      editedBudget.transportation +
                      editedBudget.utilities +
                      editedBudget.entertainment)}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
          >
            Save Changes
          </button>
        </>
      ) : (
        <div className="text-lg mt-24 text-gray-700">Loading budget data...</div>
      )}
    </div>
  );
};

export default Dashboard;
