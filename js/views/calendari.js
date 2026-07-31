import { TEMES } from "../data/temes.js";
import { SETMANES, BLOCS } from "../data/setmanes.js";
import { ACTIVITATS } from "../data/activitats.js";
import { esc } from "../helpers.js";
import { STATE } from "../state.js";
import { parseDia, avui } from "../dateUtils.js";

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

function blocHTML(k,label,dayKey,extraIdx){
  const cel=STATE.plan[k]||{};
  const act=ACTIVITATS.find(a=>a.key===cel.act);
  const fet=!!cel.fet;
  return `<div class="bloc ${fet?'fet':''}" style="border-left-color:${act?act.color:'var(--border)'}">
    <div class="blochead">
      <input class="bl" data-act="cel" data-k="${k}" data-camp="label" value="${esc(cel.label ?? label)}" />
      <span style="display:flex;gap:4px;align-items:center">
        <button class="fetbtn ${fet?'on':''}" data-act="fet" data-k="${k}" title="Marca com fet"></button>
        ${extraIdx!=null?`<button class="rmbloc" data-act="rmbloc" data-k="${dayKey}" data-idx="${extraIdx}" title="Elimina aquest bloc">×</button>`:''}
      </span>
    </div>
    <select data-act="cel" data-k="${k}" data-camp="tema">
      <option value="">— Tema —</option>
      ${TEMES.map(t=>`<option value="${t.id}" ${String(cel.tema)===String(t.id)?'selected':''}>T${t.id} ${esc(t.curt)}</option>`).join("")}
    </select>
    <select data-act="cel" data-k="${k}" data-camp="act" style="color:${act?act.color:'var(--text)'};font-weight:${act?600:400}">
      <option value="">— Activitat —</option>
      ${ACTIVITATS.map(a=>`<option value="${a.key}" ${cel.act===a.key?'selected':''}>${a.key}</option>`).join("")}
    </select>
  </div>`;
}

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
    BLOCS.forEach(bloc=>{ h+=blocHTML(`${dayKey}-${bloc}`,bloc,dayKey,null); });
    for(let i=0;i<extraCount;i++){ h+=blocHTML(`${dayKey}-extra${i}`,`Extra ${i+1}`,dayKey,i); }
    h+=`</div><button class="addbloc" data-act="addbloc" data-k="${dayKey}">+ Afegir bloc</button>`;
    const fv=STATE.forest[dayKey]||{};
    h+=`<div class="forest">
      <span>🌲</span>
      <input type="number" min="0" step="1" inputmode="numeric" placeholder="Concentracions" data-act="forest" data-k="${dayKey}" data-camp="sessions" value="${fv.sessions??''}" />
      <input type="number" min="0" step="0.25" inputmode="decimal" placeholder="Hores reals" data-act="forest" data-k="${dayKey}" data-camp="hores" value="${fv.hores??''}" />
    </div></div>`;
  });
  h+=`</div><div class="actlegend">`+ACTIVITATS.map(a=>`<span><i style="background:${a.color}"></i>${a.key}</span>`).join("")+`</div>`;
  return h;
}
