import axios from "axios";

const api = axios.create({
  baseURL: "https://civicfix-0tmy.onrender.com/api"
});

export const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export default api;