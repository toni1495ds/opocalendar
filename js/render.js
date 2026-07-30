import { $ } from "./helpers.js";
import { diesExamen, stats } from "./stats.js";
import { viewAvui } from "./views/avui.js";
import { viewTemes } from "./views/temes.js";
import { viewPrioritat } from "./views/prioritat.js";
import { viewCalendari } from "./views/calendari.js";

export let vista="avui";
export function setVista(v){ vista=v; }

function renderHeader(){
  $("#dies").textContent=diesExamen();
  const s=stats();
  $("#pct").textContent=s.pct; $("#fill").style.width=s.pct+"%";
  $("#st-fetes").textContent=s.fetes; $("#st-total").textContent=s.total;
  $("#st-dom").textContent=s.d; $("#st-mig").textContent=s.g; $("#st-pend").textContent=s.p;
}

export function render(){
  renderHeader();
  const v=$("#view"); if(!v)return;
  if(vista==="avui")v.innerHTML=viewAvui();
  else if(vista==="temes")v.innerHTML=viewTemes();
  else if(vista==="prioritat")v.innerHTML=viewPrioritat();
  else if(vista==="calendari")v.innerHTML=viewCalendari();
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v===vista));
}
