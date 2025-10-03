import { useEffect } from "react";
export default function Modal({ open, onClose, title, children, footer }){
useEffect(()=>{
const onKey=e=>e.key==="Escape"&&onClose?.();
if(open) window.addEventListener("keydown", onKey);
return ()=>window.removeEventListener("keydown", onKey);
},[open,onClose]);
if(!open) return null;
return (
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"grid",placeItems:"center",zIndex:50}}>
<div className="u-card u-border" style={{width:"min(920px,94vw)",padding:18}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<h3 style={{fontSize:18,margin:0}}>{title}</h3>
<button className="u-btn ghost" onClick={onClose}>Đóng</button>
</div>
<div style={{maxHeight:"72vh",overflow:"auto"}}>{children}</div>
{footer && <div style={{marginTop:12,display:"flex",gap:8,justifyContent:"flex-end"}}>{footer}</div>}
</div>
</div>
);
}