import { ACTIVITATS } from "../data/activitats.js";
import { SETMANES, BLOCS } from "../data/setmanes.js";
import { esc } from "../helpers.js";
import { STATE } from "../state.js";
import { trobaAvui } from "../dateUtils.js";
import { blocHTML, testsHTML } from "./shared.js";

export function viewAvui(){
  let h=`<div class="sechead"><div class="n">◉</div><div class="d">Planifica i marca com fet el que treballes avui, igual que a Calendari.</div></div>`;

  const info=trobaAvui(SETMANES);
  if(!info){
    h+=`<div class="card" style="color:var(--muted);font-size:13px">Avui és fora del període de temari (27/07 – 14/11).</div>`;
    return h;
  }

  const dayKey=`${info.setmana}-${info.di}`;
  const extraCount=STATE.extra[dayKey]||0;

  h+=`<div class="weeklbl">${esc(info.dia)}</div>`;
  h+=`<div class="day today">
    <div class="blocs">`;
  const amagats=STATE.amagats[dayKey]||[];
  BLOCS.forEach(bloc=>{ if(!amagats.includes(bloc))h+=blocHTML(`${dayKey}-${bloc}`,bloc,dayKey,null); });
  for(let i=0;i<extraCount;i++){ h+=blocHTML(`${dayKey}-extra${i}`,`Extra ${i+1}`,dayKey,i); }
  h+=`</div><button class="addbloc" data-act="addbloc" data-k="${dayKey}">+ Afegir bloc</button>`;
  h+=testsHTML(dayKey);
  h+=`</div>`;
  h+=`<div class="actlegend">`+ACTIVITATS.map(a=>`<span><i style="background:${a.color}"></i>${a.key}</span>`).join("")+`</div>`;
  return h;
}
