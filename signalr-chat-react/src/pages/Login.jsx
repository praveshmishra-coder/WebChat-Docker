import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Validation
  const validate = () => {
  // Email required
  if (!email.trim()) {
    toast.error("Email is required");
    return false;
  }

  // Password required
  if (!password.trim()) {
    toast.error("Password is required");
    return false;
  }

  // Email format check
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email");
    return false;
  }

  // Password strength check (optional for login, but good UX)
  // Require at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-])[A-Za-z\d@$!%*?&#^()_+=\-]{8,}$/;

  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be at least 8 characters and include uppercase, lowercase, number & symbol"
    );
    return false;
  }

  return true;
};


  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // ❌ Never show backend errors
      if (!res.ok) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const user = await res.json();

      // 🔐 Store auth data
      localStorage.setItem("username", user.username);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", user.token);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          New user?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
