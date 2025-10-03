import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  gridTemplateRows: "60px 1fr",
  height: "100vh",
  background: "#f4f6f9",
  fontFamily: "Inter, sans-serif",
};

export default function AdminLayout() {
  return (
    <div style={layoutStyle}>
      <aside
        style={{
          gridRow: "1 / span 2",
          borderRight: "1px solid #e0e0e0",
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        }}
      >
        <AdminSidebar />
      </aside>

      <header
        style={{
          gridColumn: 2,
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <AdminHeader />
      </header>

      <main style={{ padding: 20, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
