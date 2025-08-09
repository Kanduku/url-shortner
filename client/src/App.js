import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (<div className="App">
    <Router>
      <Routes>
        {/* Default route shows Login */}
        <Route path="/" element={<Login />} />

        {/* Home route */}
        <Route path="/home" element={<Home />} />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
