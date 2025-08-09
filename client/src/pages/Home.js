import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "./../api/api";
import UrlList from "../components/UrlList";
import "./Home.css";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const [input, setInput] = useState("");
  const [urls, setUrls] = useState([]);

  // Redirect if no username
  useEffect(() => {
    if (!username) navigate("/");
  }, [username, navigate]);

  const fetchUrls = async () => {
    const res = await API.get("/shorten", {
      headers: { "x-username": username }
    });
    setUrls(res.data);
  };

  const handleShorten = async () => {
    if (!input.trim()) return;
    await API.post("/shorten", { original_url: input }, {
      headers: { "x-username": username }
    });
    setInput("");
    fetchUrls();
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    if (username) fetchUrls();
  }, [username]);

  return (
    <div className="home-container" style={{ padding: "20px" }}>
      <h2 className="home-title">URL Shortener</h2>
      <p className="welcome-text">Welcome <strong>{username}</strong></p>
      <button className="logout-button" onClick={handleLogout} style={{ marginBottom: "10px" }}>
        Logout
      </button>
      <br />
      <input
        className="url-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="       Enter URL"
      />
      <button className="shorten-button" onClick={handleShorten}>
        Shorten
      </button>
      <UrlList urls={urls} />
    </div>
  );
}

export default Home;
