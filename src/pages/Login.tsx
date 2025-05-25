import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() != "" && password.trim() != "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const data = response.data;
      console.log("Login response data:");
      if (!response.data) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col grid grid-cols-2 items-center justify-center min-h-screen bg-white">
      <div className="bg-gradient-to-t from-blue-600 to-blue-900 items-center h-[750px] flex flex-col justify-center">
        <h1 className="text-xl font-bold text-white p-4">
          HDJ Financial Tracker
        </h1>
        <h2 className=" text-white">Track your income, monitor expenses, and stay on top of your monthly budget — all in one simple dashboard.</h2>
      </div>
      <div className="flex flex-col justify-center rounded shadow-md h-[750px]">
        <form
          onSubmit={handleLogin}
          className=" p-10 w-80 mx-auto"
        >
          <h2 className="text-xl font-bold mb-4  text-black">Welcome Back</h2>

          <p className="text-lg font-semibold mb-4 text-black">Login</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-400 rounded bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-400  rounded bg-white"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className={`w-full !font-bold p-2 !rounded-xl !border-none !text-white
        ${
          isFormValid
            ? "!bg-blue-500 !text-white"
            : "!bg-gray-300 !text-gray-600 cursor-not-allowed"
        }${isLoading && "bg-gray-400 cursor-wait"}`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
