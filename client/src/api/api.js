import axios from "axios";

const API = axios.create({
  baseURL: "https://url-shortner-k92v.onrender.com/", // backend URL
});

export default API;
