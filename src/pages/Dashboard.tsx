import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log(
      "🚀 Dashboard Rendered! isAuthenticated:",
      auth?.isAuthenticated
    );
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
    <div className="flex flex-col items-center justify-center p-6 text-white bg-gradient-to-t from-blue-600 to-blue-200 min-h-screen">
<div className="w-full fixed top-0 z-50 text-white bg-gray-900 flex items-center justify-between p-4">
{/* Added fixed top-0 and z-50 to force div to the top, bypassing parent */}
<h1> Logo </h1>
        <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>
        <div>
          {" "}
          <button
            onClick={auth.logout}
            className="mt-4 !bg-red-500 !border-0 text-white p-2 rounded !font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
