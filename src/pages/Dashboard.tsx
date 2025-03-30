import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log("🚀 Dashboard Rendered! isAuthenticated:", auth?.isAuthenticated);
    if (auth?.isAuthenticated !== null) {
      setIsAuthChecked(true);
    }
  }, [auth?.isAuthenticated]);

  if (!isAuthChecked) {
    return <div className="text-white">Checking authentication...</div>;
  }

  if (!auth?.isAuthenticated) {
    console.warn("🔴 Redirecting to login because user is not authenticated");
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>
      <button
        onClick={auth.logout}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
