import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return token ? children : null;
}
