import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =  email.trim() != "" &&  password.trim() != ""

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
      console.log("Login response data:", );
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
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-blue-600 to-blue-200">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-black">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} 
        className="w-full p-2 mb-3 border text-black border-black rounded bg-white" />
        <input
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border text-black border-black rounded bg-white"/>
          {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className={`w-full !font-bold p-2 !rounded-lg !border-none 
        ${ isFormValid ? "!bg-blue-500 !text-white" : "!bg-gray-300 !text-gray-600 cursor-not-allowed"
        }${isLoading && "bg-gray-400 cursor-wait"}`}
      >
          {isLoading ? "Logging in..." : "Login"}
          </button>
      </form>
    </div>
  );
};

export default Login;
