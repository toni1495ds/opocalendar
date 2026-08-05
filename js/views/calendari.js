import { SETMANES, BLOCS } from "../data/setmanes.js";
import { ACTIVITATS } from "../data/activitats.js";
import { esc } from "../helpers.js";
import { STATE } from "../state.js";
import { parseDia, avui } from "../dateUtils.js";
import { blocHTML, testsHTML } from "./shared.js";

function computeSetmanaActual(){
  const today=avui();
  for(const s of SETMANES){
    const last=parseDia(s.dies[s.dies.length-1]);
    if(today<=last) return s.s;
  }
  return SETMANES[SETMANES.length-1].s;
}
const SETMANA_ACTUAL=computeSetmanaActual();

let setmSel=SETMANA_ACTUAL;
export function setSetmSel(v){ setmSel=v; }

export function viewCalendari(){
  const w=SETMANES.find(x=>x.s===setmSel);
  const today=avui();
  let h=`<div class="sechead"><div class="n">▦</div><div class="d">Planifica cada bloc del dia amb un tema i una activitat. Marca'l com fet quan l'acabis. Pots afegir més blocs si un dia et queda curt.</div></div>`;
  h+=`<div class="weeks">`+SETMANES.map(x=>{
    const last=parseDia(x.dies[x.dies.length-1]);
    const past=last<today;
    return `<button class="${setmSel===x.s?'on':''} ${past?'past':''}" data-act="setm" data-v="${x.s}">S${x.s}</button>`;
  }).join("")+`</div>`;
  h+=`<div class="weeklbl">Setmana ${setmSel} · ${w.rang}${setmSel!==SETMANA_ACTUAL?`<button class="jumptoday" data-act="setm" data-v="${SETMANA_ACTUAL}">Anar a avui</button>`:''}</div>`;
  const diesIdx=w.dies.map((dia,di)=>({dia,di,date:parseDia(dia)}));
  const propers=diesIdx.filter(x=>x.date>=today);
  const passats=diesIdx.filter(x=>x.date<today);
  const ordre=[...propers,...passats];
  h+=`<div class="list">`;
  ordre.forEach(({dia,di,date},i)=>{
    const isExamen=dia.includes("EXAMEN");
    const isPast=date<today;
    const isToday=date.getTime()===today.getTime();
    const dayKey=`${setmSel}-${di}`;
    const extraCount=STATE.extra[dayKey]||0;
    if(passats.length>0&&ordre[i]===passats[0]){
      h+=`<div class="pastsep">Dies anteriors d'aquesta setmana</div>`;
    }
    h+=`<div class="day ${isPast?'past':''} ${isToday?'today':''}">
      <div class="dayname ${isExamen?'examen':''}"><span class="dot"></span>${esc(dia)}${isToday?'<span class="todaytag">AVUI</span>':''}</div>
      <div class="blocs">`;
    const amagats=STATE.amagats[dayKey]||[];
    BLOCS.forEach(bloc=>{ if(!amagats.includes(bloc))h+=blocHTML(`${dayKey}-${bloc}`,bloc,dayKey,null); });
    for(let i=0;i<extraCount;i++){ h+=blocHTML(`${dayKey}-extra${i}`,`Extra ${i+1}`,dayKey,i); }
    h+=`</div><button class="addbloc" data-act="addbloc" data-k="${dayKey}">+ Afegir bloc</button>`;
    h+=testsHTML(dayKey);
    h+=`</div>`;
  });
  h+=`</div><div class="actlegend">`+ACTIVITATS.map(a=>`<span><i style="background:${a.color}"></i>${a.key}</span>`).join("")+`</div>`;
  return h;
}
