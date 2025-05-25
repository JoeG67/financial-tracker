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

  const date = new Date();

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
      console.error(
        "Error fetching user email:",
        err.response?.data?.message || err.message
      );
    }
  };

  const fetchBudgetData = async (email: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user-budget/${email}`
      );
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
      await axios.put(
        `http://localhost:5000/api/user-budget/${userEmail}`,
        editedBudget
      );
      setBudgetData(editedBudget);
      alert("Budget updated successfully!");
    } catch (err) {
      console.error("Failed to update budget", err);
      alert("Failed to save changes.");
    }
  };

  if (!isAuthChecked)
    return <div className="text-white">Checking authentication...</div>;

  if (!auth?.isAuthenticated) {
    console.warn("🔴 Redirecting to login because user is not authenticated");
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-black bg-blue-100 min-h-screen">
      <div className="w-full fixed top-0 z-50 text-white bg-[#30363c] flex items-center justify-between p-2">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/038/516/357/small/ai-generated-eagle-logo-design-in-black-style-on-transparant-background-png.png"
          alt="Logo"
          className="w-[60px] h-[60px] object-contain"
        />

        <div>
          <button
            onClick={auth.logout}
            className=" !bg-red-500 !border-0 !p-2 text-white !rounded-lg !font-bold"
          >
            <h2 className="text-sm font-bold">Logout</h2>
          </button>
        </div>
      </div>
      <div>
        {budgetData && editedBudget ? (
          <>
            <h2 className="text-xl font-bold mt-24 px-6">
              Welcome back, {userEmail || "User"}. The current date is<p>{new Date().toDateString()}</p>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mt-10">
              {[
                "initial_balance",
                "phone_bill",
                "transportation",
                "utilities",
                "entertainment",
              ].map((field) => (
                <div
                  key={field}
                  className="bg-white rounded-lg  shadow p-4 text-lg text-left text-black !pb-4"
                >
                  <label className="block capitalize mb-2">
                    {field !== "initial_balance" ? "Your monthly " : "Your "}
                    {field.replace("_", " ")}{" "}
                    {field !== "initial_balance" ? "cost " : ""} is:
                  </label>
                  <input
                    type="number"
                    value={editedBudget[field]}
                    onChange={(e) =>
                      handleChange(field, Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}

              <div className="bg-white rounded-lg shadow p-3">
                <p className="">
                  <p className="text-lg text-left text-black !pb-4">
                    {" "}
                    Your remaining balance is{" "}
                  </p>

                  <span className="text-green-500 text-xl">
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
              className="mt-10 !bg-green-600 !border-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <div className="text-lg mt-24 text-gray-700">
            Loading budget data...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
