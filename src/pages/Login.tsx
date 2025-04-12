import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const data = response.data;
      if (!response.data) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-blue-600 to-blue-200">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white rounded shadow-md w-80"
      >
        <h2 className="text-xl font-semibold mb-4 text-black">Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border text-black border-black rounded bg-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border text-black border-black rounded bg-white"
        />

        <button
          type="submit"
          className="w-full text-black p-2 rounded border !bg-blue-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
