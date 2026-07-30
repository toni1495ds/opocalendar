import { SETMANES, BLOCS } from "../data/setmanes.js";
import { STATE } from "../state.js";
import { stats } from "../stats.js";

function resumSetmana(s){
  let fets=0,total=0,sessions=0,minuts=0;
  s.dies.forEach((dia,di)=>{
    const dayKey=`${s.s}-${di}`;
    const extraCount=STATE.extra[dayKey]||0;
    BLOCS.forEach(b=>{
      const cel=STATE.plan[`${dayKey}-${b}`]||{};
      if(cel.tema||cel.act){ total++; if(cel.fet)fets++; }
    });
    for(let i=0;i<extraCount;i++){
      const cel=STATE.plan[`${dayKey}-extra${i}`]||{};
      if(cel.tema||cel.act){ total++; if(cel.fet)fets++; }
    }
    const fv=STATE.forest[dayKey]||{};
    sessions+=Number(fv.sessions)||0; minuts+=Number(fv.minuts)||0;
  });
  return {fets,total,sessions,minuts};
}

export function viewEstadistiques(){
  const s=stats();
  let totalSessions=0,totalMinuts=0,diesAmbDades=0;
  Object.values(STATE.forest).forEach(v=>{
    const ss=Number(v.sessions)||0, mm=Number(v.minuts)||0;
    if(ss>0||mm>0)diesAmbDades++;
    totalSessions+=ss; totalMinuts+=mm;
  });
  const mitjanaMin=diesAmbDades?Math.round(totalMinuts/diesAmbDades):0;
  const hores=(totalMinuts/60).toFixed(1);

  let h=`<div class="sechead"><div class="n">◒</div><div class="d">Resum del temari, del calendari complert i del temps real d'estudi amb Forest.</div></div>`;

  h+=`<div class="statgrid">
    <div class="statcard"><div class="v">${s.pct}%</div><div class="l">Temari complet</div></div>
    <div class="statcard"><div class="v">${totalSessions}</div><div class="l">Concentracions Forest</div></div>
    <div class="statcard"><div class="v">${hores}h</div><div class="l">Hores reals d'estudi</div></div>
    <div class="statcard"><div class="v">${mitjanaMin}</div><div class="l">Minuts / dia de mitjana</div></div>
  </div>`;

  h+=`<div class="list">`;
  SETMANES.forEach(s2=>{
    const r=resumSetmana(s2);
    h+=`<div class="statrow"><span class="lbl2">S${s2.s} · ${s2.rang}</span>
      <span class="nums"><span>${r.fets}/${r.total} blocs</span><span>🌲 ${r.sessions}</span><span>${r.minuts} min</span></span></div>`;
  });
  h+=`</div>`;
  return h;
}
