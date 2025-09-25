const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/200x150?text=No+Image";

export default function CategoryCard({ id, name, image, selected, onSelect }) {
  // build URL ảnh
  const img = image
    ? (image.startsWith("http")
        ? image
        : `${API_BASE}/assets/images/${image}`)
    : PLACEHOLDER;

  return (
    <div
      onClick={() => onSelect && onSelect(id)}
      style={{
        background: selected ? "#c8e6c9" : "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #e0f2f1",
        padding: "16px",
        minWidth: 150,
        textAlign: "center",
        fontWeight: 500,
        fontSize: 16,
        color: "#388e3c",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          height: 100,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 8,
          background: "#f1f8e9",
        }}
      >
        <img
          src={img}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      {name}
    </div>
  );
}
