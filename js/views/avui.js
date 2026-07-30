import { TEMES } from "../data/temes.js";
import { SETMANES, BLOCS } from "../data/setmanes.js";
import { ACTIVITATS } from "../data/activitats.js";
import { esc } from "../helpers.js";
import { STATE } from "../state.js";
import { trobaAvui } from "../dateUtils.js";

export function viewAvui(){
  let h=`<div class="sechead"><div class="n">↗</div><div class="d">El que tens planificat per avui al calendari. Marca-ho com fet quan ho acabis.</div></div>`;

  const info=trobaAvui(SETMANES);
  if(!info){
    h+=`<div class="card" style="color:var(--muted);font-size:13px">Avui és fora del període de temari (27/07 – 14/11).</div>`;
    return h;
  }

  const dayKey=`${info.setmana}-${info.di}`;
  const extraCount=STATE.extra[dayKey]||0;
  const blocs=[
    ...BLOCS.map(b=>({key:`${dayKey}-${b}`,label:b})),
    ...Array.from({length:extraCount},(_,i)=>({key:`${dayKey}-extra${i}`,label:`Extra ${i+1}`})),
  ].map(b=>({...b,cel:STATE.plan[b.key]||{}}));
  const planificats=blocs.filter(b=>b.cel.tema||b.cel.act);

  h+=`<div class="weeklbl">${esc(info.dia)}</div>`;

  if(planificats.length===0){
    h+=`<div class="card" style="color:var(--muted);font-size:13px">Encara no has planificat res per avui.<br>Ves a la pestanya <b>Calendari</b> per triar tema i activitat per cada bloc del dia.</div>`;
    return h;
  }

  h+=`<div style="display:flex;flex-direction:column;gap:12px">`;
  planificats.forEach(b=>{
    const tema=TEMES.find(t=>String(t.id)===String(b.cel.tema));
    const act=ACTIVITATS.find(a=>a.key===b.cel.act);
    const fet=!!b.cel.fet;
    h+=`<div class="card ${fet?'':'today'}" style="${fet?'opacity:.55':''}"><div class="top"><div>
      <div class="meta"><span class="tid">${esc(b.cel.label ?? b.label)}</span>${act?`<span class="preg" style="color:${act.color}">${act.key}</span>`:''}</div>
      <div class="tnom">${tema?esc(tema.nom):'(sense tema assignat)'}</div></div>
      <button class="estat-btn" data-act="fet" data-k="${b.key}" style="border-color:${fet?'var(--e-dom)':'var(--border2)'};color:${fet?'var(--e-dom)':'var(--muted)'}">${fet?'Fet ✓':'Marca fet'}</button>
    </div></div>`;
  });
  h+=`</div>`; return h;
}
