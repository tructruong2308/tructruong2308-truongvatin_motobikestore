import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000";

export default function CategoryProducts() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const [rc, rp] = await Promise.all([
          fetch(`${API_BASE}/categories/${id}`, { signal: ac.signal }),
          fetch(`${API_BASE}/categories/${id}/products`, { signal: ac.signal }),
        ]);
        const c = await rc.json(); const p = await rp.json();
        setName(c?.name || c?.data?.name || `Danh mục #${id}`);
        setItems(Array.isArray(p) ? p : p?.data || []);
      } finally { setLoading(false); }
    })();
    return () => ac.abort();
  }, [id]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter(x => `${x.name} ${x.description || ""}`.toLowerCase().includes(s)) : items;
  }, [items, q]);

  return (
    <div className="u-grid" style={{ gap: 16 }}>
      <div className="u-card u-border" style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{name}</h2>
        <div style={{ flex: 1 }} />
        <input className="u-input" placeholder="Tìm trong danh mục…" value={q} onChange={e => setQ(e.target.value)} style={{ minWidth: 240 }} />
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />)
          : list.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
