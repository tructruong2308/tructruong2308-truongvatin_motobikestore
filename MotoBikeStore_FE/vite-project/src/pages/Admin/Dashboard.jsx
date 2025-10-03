import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const [auth, setAuth] = useState({ checked: false, allow: false });

  // ✅ Kiểm tra token + quyền
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
      setAuth({ checked: true, allow: false });
    } else if (user.roles === "admin") {
      setAuth({ checked: true, allow: true });
    } else {
      setAuth({ checked: true, allow: false });
    }
  }, []);

  if (!auth.checked) {
    return <div className="p-6">⏳ Đang kiểm tra quyền truy cập...</div>;
  }

  if (!auth.allow) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Giao diện Dashboard chỉ có video
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>

      {/* Video demo nhỏ gọn */}
      <div className="w-full max-w-3xl">
        <video
          width="75%"
          controls
          className="rounded-lg shadow-lg border"
        >
          <source src="http://127.0.0.1:8000/assets/video/luffy.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
    </section>
  );
}
