export default function Badge({ color="default", children }){
const map = {
default: {bg:"rgba(255,255,255,.08)", fg:"#c9d4ff"},
success: {bg:"rgba(24,178,107,.18)", fg:"#6fe0b1"},
warn: {bg:"rgba(255,176,32,.18)", fg:"#ffd585"},
danger: {bg:"rgba(251,90,90,.18)", fg:"#ff9b9b"},
info: {bg:"rgba(91,140,255,.18)", fg:"#9fbbff"},
}[color] || this.default;
return <span className="u-badge" style={{background:map.bg,color:map.fg}}>{children}</span>
}