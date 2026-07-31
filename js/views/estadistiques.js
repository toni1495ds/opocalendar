import { SETMANES, BLOCS } from "../data/setmanes.js";
import { STATE } from "../state.js";
import { stats } from "../stats.js";

function resumSetmana(s){
  let fets=0,total=0,sessions=0,hores=0;
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
    sessions+=Number(fv.sessions)||0; hores+=Number(fv.hores)||0;
  });
  return {fets,total,sessions,hores};
}

export function viewEstadistiques(){
  const s=stats();
  let totalSessions=0,totalHores=0,diesAmbDades=0;
  Object.values(STATE.forest).forEach(v=>{
    const ss=Number(v.sessions)||0, hh=Number(v.hores)||0;
    if(ss>0||hh>0)diesAmbDades++;
    totalSessions+=ss; totalHores+=hh;
  });
  const mitjanaHores=diesAmbDades?(totalHores/diesAmbDades).toFixed(1):"0";

  let h=`<div class="sechead"><div class="n">◒</div><div class="d">Resum del temari, del calendari complert i del temps real d'estudi amb Forest.</div></div>`;

  h+=`<div class="statgrid">
    <div class="statcard"><div class="v">${s.pct}%</div><div class="l">Temari complet</div></div>
    <div class="statcard"><div class="v">${totalSessions}</div><div class="l">Concentracions Forest</div></div>
    <div class="statcard"><div class="v">${totalHores.toFixed(1)}h</div><div class="l">Hores reals d'estudi</div></div>
    <div class="statcard"><div class="v">${mitjanaHores}h</div><div class="l">Mitjana / dia estudiat</div></div>
  </div>`;

  h+=`<div class="list">`;
  SETMANES.forEach(s2=>{
    const r=resumSetmana(s2);
    h+=`<div class="statrow"><span class="lbl2">S${s2.s} · ${s2.rang}</span>
      <span class="nums"><span>${r.fets}/${r.total} blocs</span><span>🌲 ${r.sessions}</span><span>${r.hores.toFixed(1)}h</span></span></div>`;
  });
  h+=`</div>`;
  return h;
}
