import React from "react";
import { AdminMenu } from "../header/AdminMenu.tsx";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <AdminMenu />
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "40px", minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
};
