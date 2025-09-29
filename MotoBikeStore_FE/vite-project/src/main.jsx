import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./index.css";

// ===== Customer pages =====
import Home from "./pages/Customers/Home";
import Products from "./pages/Customers/Products";
import Cart from "./pages/Customers/Cart";
import ProductDetail from "./pages/Customers/ProductDetail";
import CategoryProducts from "./pages/Customers/CategoryProducts";
import Register from "./pages/Customers/Register";
import Login from "./pages/Customers/Login";
import Checkout from "./pages/Customers/Checkout";

// ===== Admin pages/layout =====
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Product/Products";
import AdminCategories from "./pages/Admin/Category/Categories";
import AdminOrders from "./pages/Admin/Order/Orders";
import AdminUsers from "./pages/Admin/User/Users";

// ---- Hàm logout (gọi API + xoá localStorage) ----
const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await res.json().catch(() => ({})); // ignore lỗi JSON
    }
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // chuyển về login
  }
};

// ---- Layout cho phần khách hàng ----
function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 border-b bg-white shadow-sm flex items-center justify-between">
        {/* Logo bên trái */}
        <div className="font-bold text-green-700 text-lg">🏍️ MotoBikeStore</div>

        {/* Menu giữa */}
        <nav className="flex gap-8 text-gray-700 font-medium">
          <NavLink to="/" end className="hover:text-green-700">
            Trang chủ
          </NavLink>
          <NavLink to="/products" className="hover:text-green-700">
            Sản phẩm
          </NavLink>
          <NavLink to="/cart" className="hover:text-green-700">
            Giỏ hàng
          </NavLink>
        </nav>

        {/* Avatar / Menu bên phải */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border hover:ring-2 hover:ring-green-500 transition"
          >
            <img alt="avatar" className="w-full h-full object-cover" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    👋 Xin chào, <b>{user.name}</b>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Đăng ký
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Đăng nhập
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t text-sm text-gray-600 text-center">
        © {new Date().getFullYear()} MotoBikeStore
      </footer>
    </div>
  );
}

// ---- App chính ----
function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Mỗi lần cart thay đổi thì lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Hàm thêm sản phẩm (chỉ alert nếu chưa login)
  const addToCart = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi thêm sản phẩm!");
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price || product.unit_price || 0,
      thumbnail_url: product.thumbnail_url || product.image || "",
    };

    setCart((prev) => {
      const exists = prev.find((i) => i.id === newItem.id);
      return exists
        ? prev.map((i) =>
            i.id === newItem.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...newItem, qty: 1 }];
    });

    alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ====== Customer routes ====== */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products addToCart={addToCart} /></Layout>} />
        <Route path="/category/:id" element={<Layout><CategoryProducts addToCart={addToCart} /></Layout>} />
        <Route path="/categories/:id" element={<Navigate to="/category/:id" replace />} />
        <Route path="/products/:id" element={<Layout><ProductDetail addToCart={addToCart} /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout cart={cart} setCart={setCart} /></Layout>} />
        <Route path="/cart" element={<Layout><Cart cart={cart} setCart={setCart} /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />

        {/* ====== Admin routes ====== */}
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
