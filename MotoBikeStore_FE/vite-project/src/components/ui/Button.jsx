export default function Button({ as:Tag="button", className="", variant="solid", ...props }){
const cls = [
"u-btn",
variant==="outline"?"outline":"",
variant==="ghost"?"ghost":"",
className
].filter(Boolean).join(" ");
return <Tag className={cls} {...props} />
}