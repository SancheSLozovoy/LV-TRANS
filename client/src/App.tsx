import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/Login.tsx";
import { Register } from "./pages/register/Register.tsx";
import { Home } from "./pages/home/Home.tsx";
import { Profile } from "./pages/profile/Profile.tsx";
import { ProtectedRoute } from "./components/НОС/HOC.tsx";
import "./styles/global.scss";
import { JSX } from "react";
import { NotFoundPage } from "./pages/404/404.tsx";
import { CreateOrder } from "./pages/createOrder/CreateOrder.tsx";

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateOrder />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
