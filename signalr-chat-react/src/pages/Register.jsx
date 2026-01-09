import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Validation
  const validate = () => {
  if (!username.trim()) {
    toast.error("Username is required");
    return false;
  }

  if (username.length < 3) {
    toast.error("Username must be at least 3 characters");
    return false;
  }

  if (!email.trim()) {
    toast.error("Email is required");
    return false;
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email");
    return false;
  }

  if (!password.trim()) {
    toast.error("Password is required");
    return false;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-])[A-Za-z\d@$!%*?&#^()_+=\-]{8,}$/;

  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
    return false;
  }

  return true;
};


  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      // ❌ Never expose backend error details
      if (!res.ok) {
        throw new Error("REGISTRATION_FAILED");
      }

      const user = await res.json();

      // 🔐 Store auth data
      localStorage.setItem("username", user.username);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", user.token);

      toast.success("Registration successful");

      navigate("/dashboard");
    } catch {
      toast.error("Registration failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

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
        <p className="text-xs text-gray-500 mb-3">
          Password must be 8+ chars with uppercase, lowercase, number & symbol
        </p>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
