import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/Login.tsx";
import { Register } from "./pages/register/Register.tsx";
import { Home } from "./pages/home/Home.tsx";
import "./styles/global.scss";
import React from "react";
import { Profile } from "./pages/profile/Profile.tsx";

export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
