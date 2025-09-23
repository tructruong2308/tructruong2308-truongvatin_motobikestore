import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import "./index.css"

import Home from "./pages/Customers/Home"
import Products from "./pages/Customers/Products"
import Cart from "./pages/Customers/Cart"
import ProductDetail from "./pages/Customers/ProductDetail"
// ✅ import thêm
import CategoryProducts from "./pages/Customers/CategoryProducts"

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="logo">🍃 StoreVegetables</div>
        <nav>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer>© {new Date().getFullYear()} StoreVegetables</footer>
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      } else {
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products addToCart={addToCart} /></Layout>} />
        {/* ✅ route hiển thị sản phẩm theo danh mục */}
        <Route path="/category/:id" element={<Layout><CategoryProducts addToCart={addToCart} /></Layout>} />
        <Route path="/products/:id" element={
          <Layout>
            <ProductDetail
              products={[
                { id: 1, name: "Rau muống", brand: "Farm A", price: 12000 },
                { id: 2, name: "Cà rốt", brand: "Farm B", price: 15000 },
                { id: 3, name: "Khoai tây", brand: "Farm C", price: 18000 },
                { id: 4, name: "Táo", brand: "Farm D", price: 25000 },
              ]}
              addToCart={addToCart}
            />
          </Layout>
        } />
        <Route path="/cart" element={<Layout><Cart cart={cart} /></Layout>} />
        <Route path="*" element={<Layout><div>Không tìm thấy trang</div></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)
