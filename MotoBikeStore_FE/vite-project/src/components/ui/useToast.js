import { useCallback, useEffect, useState } from "react";
export function useToast(){
const [items,setItems]=useState([]);
const push = useCallback((msg,type="info")=>{
const id=crypto.randomUUID();
setItems(v=>[...v,{id,msg,type}]);
setTimeout(()=>setItems(v=>v.filter(x=>x.id!==id)),3000);
},[]);
const View = ()=> (
<div style={{position:"fixed",right:14,bottom:14,display:"grid",gap:8,zIndex:60}}>
{items.map(t=> (
<div key={t.id} className="u-card" style={{padding:"10px 14px",border:"1px solid rgba(255,255,255,.08)"}}>
<div style={{fontWeight:700}}>{t.type.toUpperCase()}</div>
<div style={{opacity:.9}}>{t.msg}</div>
</div>
))}
</div>
);
return { push, ToastView:View };
}