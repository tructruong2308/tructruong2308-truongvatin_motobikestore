// src/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiTag, FiShoppingCart, FiUsers } from "react-icons/fi";

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  textDecoration: "none",
  color: isActive ? "#0f62fe" : "#333",
  background: isActive ? "rgba(15, 98, 254, 0.08)" : "transparent",
  borderRadius: 8,
  marginBottom: 6,
  fontWeight: 500,
  transition: "all 0.2s",
});

export default function AdminSidebar() {
  return (
    <div style={{ padding: 16, height: "100%", background: "#fff" }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 20,
          textTransform: "uppercase",
          color: "#0f62fe",
          letterSpacing: 1,
        }}
      >
        Admin
      </div>
      <nav>
        <NavLink to="/admin" end style={linkStyle}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" style={linkStyle}>
          <FiBox /> Products
        </NavLink>
        <NavLink to="/admin/categories" style={linkStyle}>
          <FiTag /> Categories
        </NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>
          <FiShoppingCart /> Orders
        </NavLink>
        <NavLink to="/admin/users" style={linkStyle}>
          <FiUsers /> Users
        </NavLink>
      </nav>
    </div>
  );
}
