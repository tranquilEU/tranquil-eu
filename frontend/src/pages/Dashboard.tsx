import { useNavigate } from "react-router-dom";
import { useGetApiMe, usePostApiAuthLogout } from "../shared/api/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetApiMe();
  const { mutate } = usePostApiAuthLogout({
    mutation: {
      onSuccess: () => {
        navigate("/login");
      },
    },
  });

  const handleLogout = () => {
    mutate({
      data: {
        refreshToken: localStorage.getItem("refreshToken") ?? "",
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

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
