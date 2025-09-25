import { useNavigate } from "react-router-dom";
import { useGetApiMe } from "../api/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetApiMe();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  console.log("User data:", data);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load user</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {data?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
