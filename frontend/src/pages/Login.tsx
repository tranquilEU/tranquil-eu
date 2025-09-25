import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostApiAuthLogin } from "../api/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, isError } = usePostApiAuthLogin({
    mutation: {
      onSuccess: (data) => {
        // Save tokens
        localStorage.setItem("accessToken", data.accessToken ?? "");
        localStorage.setItem("refreshToken", data.refreshToken ?? "");
        navigate("/dashboard");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        alert(error.response?.data?.message || "Login failed");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ data: { email, password } });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
        {isError && <p style={{ color: "red" }}>Login failed</p>}
      </form>
    </div>
  );
};

export default Login;
