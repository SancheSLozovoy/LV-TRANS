import React from "react";
import { AdminMenu } from "../header/AdminMenu.tsx";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <AdminMenu />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "40px",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};
