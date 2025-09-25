// src/main.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from "react-router-dom";
import "./index.css";

// ===== Customer pages =====
import Home from "./pages/Customers/Home";
import Products from "./pages/Customers/Products";
import Cart from "./pages/Customers/Cart";
import ProductDetail from "./pages/Customers/ProductDetail";
import CategoryProducts from "./pages/Customers/CategoryProducts";
import Register from "./pages/Customers/Register";


// ===== Admin pages/layout =====
import Dashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import AdminCategories from "./pages/Admin/Categories";
import AdminOrders from "./pages/Admin/Orders";
import AdminUsers from "./pages/Admin/Users";

// ---- Layout khách hàng ----
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 border-b flex items-center justify-between">
        <div className="font-semibold">MotoBikeStore🏍️🛵</div>
        <nav className="flex gap-4">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
          <NavLink to="/register">Đăng ký</NavLink>
        </nav>
      </header>

      <main className="flex-1 p-4">{children}</main>

      <footer className="px-4 py-3 border-t text-sm text-gray-600">
        © {new Date().getFullYear()} MotoBikeStore
      </footer>
    </div>
  );
}

// ---- Layout admin ----
function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 border-b flex items-center justify-between">
        <div className="font-semibold">Admin Panel</div>
        <nav className="flex gap-4">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

// ---- App chính ----
function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Customer routes ===== */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products addToCart={addToCart} /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail addToCart={addToCart} /></Layout>} />
        <Route path="/category/:id" element={<Layout><CategoryProducts addToCart={addToCart} /></Layout>} />
        <Route path="/categories/:id" element={<Navigate to="/category/:id" replace />} />
        <Route path="/cart" element={<Layout><Cart cart={cart} /></Layout>} />
        <Route path="/register" element={<Register />} />


        {/* ===== Admin routes ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Layout><div>Không tìm thấy trang</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
