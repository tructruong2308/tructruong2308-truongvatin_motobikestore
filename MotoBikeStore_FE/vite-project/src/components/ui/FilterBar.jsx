import Input from "./Input"; import Button from "./Button";
export default function FilterBar({ q, setQ, children, onReset }){
return (
<div className="u-card u-border u-hover" style={{padding:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
<Input placeholder="Tìm kiếm nhanh…" value={q} onChange={e=>setQ(e.target.value)} style={{minWidth:220}}/>
{children}
<div style={{flex:1}}/>
<Button variant="outline" onClick={onReset}>Đặt lại</Button>
</div>
);
}