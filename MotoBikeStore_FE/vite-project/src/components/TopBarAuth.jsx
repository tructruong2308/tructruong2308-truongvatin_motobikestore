import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function TopBarAuth({ logoSrc, cartCount=0, fixed=true, routes }){
const navigate = useNavigate();
const [user,setUser]=useState(null);
useEffect(()=>{
const read=()=>{ try{setUser(JSON.parse(localStorage.getItem("user")||"null"));}catch{setUser(null)} };
read();
const onStorage=e=>{ if(["user","token"].includes(e.key)) read(); };
window.addEventListener("storage",onStorage);
return ()=>window.removeEventListener("storage",onStorage);
},[]);


return (
<div style={{position:fixed?"sticky":"static",top:0,zIndex:40,backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(12,18,38,.6)"}}>
<div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",maxWidth:1200,margin:"0 auto"}}>
<Link to={routes.home}><img src={logoSrc} alt="logo" style={{height:36}}/></Link>
<div style={{flex:1}}/>
<Link to={routes.cart} className="u-btn outline" style={{position:"relative"}}>Giỏ hàng{cartCount>0 && <span className="u-badge" style={{position:"absolute",top:-8,right:-10}}>{cartCount}</span>}</Link>
{!user ? (
<>
<Link to={routes.login} className="u-btn">Đăng nhập</Link>
<Link to={routes.register} className="u-btn outline">Đăng ký</Link>
</>
) : (
<div className="u-card u-border" style={{padding:6,borderRadius:999,display:"flex",alignItems:"center",gap:8}}>
<div className="u-chip" style={{fontWeight:700}}>{user.name||"User"}</div>
<button className="u-btn ghost" onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}}>Đăng xuất</button>
</div>
)}
</div>
</div>
);
}