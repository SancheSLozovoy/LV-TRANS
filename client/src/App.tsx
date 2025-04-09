import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/Login.tsx";
import { Register } from "./pages/register/Register.tsx";
import { Home } from "./pages/home/Home.tsx";
import { Profile } from "./pages/profile/Profile.tsx";
import { ProtectedRoute } from "./components/НОС/ProtectedRoute.tsx";
import "./styles/global.scss";
import { JSX } from "react";
import { NotFoundPage } from "./pages/404/404.tsx";
import { CreateOrder } from "./pages/createOrder/CreateOrder.tsx";
import { OrderDetails } from "./pages/orderDetails/OrderDetails.tsx";
import { EditProfile } from "./pages/editProfile/EditProfile.tsx";
import { AdminPanel } from "./pages/admin/Admin.tsx";
import { UsersTable } from "./components/tables/usersTable/UsersTable.tsx";
import { OrdersTable } from "./components/tables/ordersTable/OrdersTable.tsx";

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
          <Route path="/user" element={<EditProfile />} />
          <Route path="/orders/:id" element={<OrderDetails />} />

          <Route path="/admin" element={<AdminPanel />}>
            <Route path="users" element={<UsersTable />} />
            <Route path="orders" element={<OrdersTable />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
