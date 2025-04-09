import { AdminLayout } from "../../components/layout/AdminLayout.tsx";
import { Outlet } from "react-router-dom";

export const AdminPanel = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};
