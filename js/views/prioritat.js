import { DOSSIER, BLOCS_DOSSIER } from "../data/dossier.js";
import { esc } from "../helpers.js";

let blocPrio="tots";
export function setBlocPrio(v){ blocPrio=v; }

export function viewPrioritat(){
  let arr=blocPrio==="tots"?DOSSIER:DOSSIER.filter(d=>d.bloc===blocPrio);
  arr=[...arr].sort((a,b)=>b.np-a.np);
  const maxNp=Math.max(...arr.map(d=>d.np),1);
  let h=`<div class="sechead"><div class="n">▲</div><div class="d">Dossier ØPT1M (referència 81/25): subtemes ordenats pel nombre de preguntes que han caigut a exàmens oficials. Estudia primer els de dalt.</div></div>`;
  h+=`<div class="weeks">`+
     `<button class="${blocPrio==='tots'?'on':''}" data-act="bloc" data-v="tots">Tots</button>`+
     BLOCS_DOSSIER.map(b=>`<button class="${blocPrio===b?'on':''}" data-act="bloc" data-v="${b}">${b}</button>`).join("")+`</div>`;
  h+=`<div class="list">`;
  arr.forEach(d=>{
    h+=`<div class="prio-item"><div class="prio-np"><span class="n">${d.np}</span><span class="l">PREG</span></div>
      <div class="prio-body"><div class="s">${esc(d.sub)}</div><div class="t">${esc(d.bloc)} · ${esc(d.tema)}</div>
      <div class="prio-bar"><div style="width:${(d.np/maxNp*100)}%"></div></div></div>
      <div class="prio-tag"><span style="border-color:${d.prio===1?'var(--accent)':'var(--border)'};color:${d.prio===1?'var(--accent)':'var(--muted)'}">PRIO ${d.prio}</span></div></div>`;
  });
  h+=`</div><div class="note-inline">Nota: el dossier és del temari antic 81/25. El creuament amb el 81/26 no és 1:1 (temes fusionats i de nous sense referència). Usa'l com a orientació.</div>`;
  return h;
}
