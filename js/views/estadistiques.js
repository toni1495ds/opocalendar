import { SETMANES, BLOCS } from "../data/setmanes.js";
import { TEMES } from "../data/temes.js";
import { STATE } from "../state.js";
import { esc } from "../helpers.js";
import { stats } from "../stats.js";
import { parseDia, avui } from "../dateUtils.js";

function setmanaActual(){
  const today=avui();
  for(const s of SETMANES){
    const last=parseDia(s.dies[s.dies.length-1]);
    if(today<=last) return s.s;
  }
  return SETMANES[SETMANES.length-1].s;
}

function mitjana(arr){ return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null; }
function notesDia(dayKey){
  const tests=(STATE.forest[dayKey]||{}).tests||[];
  return tests.filter(t=>t.nota!==undefined&&t.nota!==null&&t.nota!=="").map(t=>Number(t.nota));
}
const minutsForest=(cel)=>(Array.isArray(cel.forest)?cel.forest:[]).reduce((a,b)=>a+b,0);
const sessionsForest=(cel)=>(Array.isArray(cel.forest)?cel.forest:[]).length;

function resumSetmana(s){
  let fets=0,total=0,sessions=0,minuts=0; const notes=[];
  s.dies.forEach((dia,di)=>{
    const dayKey=`${s.s}-${di}`;
    const extraCount=STATE.extra[dayKey]||0;
    const amagats=STATE.amagats[dayKey]||[];
    BLOCS.forEach(b=>{
      if(amagats.includes(b))return;
      const cel=STATE.plan[`${dayKey}-${b}`]||{};
      if(cel.tema||cel.act){ total++; if(cel.fet)fets++; }
      sessions+=sessionsForest(cel); minuts+=minutsForest(cel);
    });
    for(let i=0;i<extraCount;i++){
      const cel=STATE.plan[`${dayKey}-extra${i}`]||{};
      if(cel.tema||cel.act){ total++; if(cel.fet)fets++; }
      sessions+=sessionsForest(cel); minuts+=minutsForest(cel);
    }
    notes.push(...notesDia(dayKey));
  });
  return {fets,total,sessions,hores:minuts/60,notaMitjana:mitjana(notes),numTests:notes.length};
}

export function viewEstadistiques(){
  const s=stats();

  // Concentracions Forest: cada targeta guarda la llista real de minuts de cada sessió
  // (30/45/50/60), agrupats per dia i per tema — cap suposició, són minuts reals.
  let totalSessions=0,totalMinuts=0; const perDia={}, perTema={};
  Object.entries(STATE.plan).forEach(([k,cel])=>{
    const min=minutsForest(cel);
    if(min<=0)return;
    totalSessions+=sessionsForest(cel); totalMinuts+=min;
    const dayKey=k.split("-").slice(0,-1).join("-");
    perDia[dayKey]=(perDia[dayKey]||0)+min;
    if(cel.tema)perTema[cel.tema]=(perTema[cel.tema]||0)+min;
  });
  const diesAmbDades=Object.keys(perDia).length;
  const totalHores=totalMinuts/60;
  const mitjanaHores=diesAmbDades?(totalHores/diesAmbDades).toFixed(1):"0";

  // Tests: normalment globals (no lligats a un tema), guardats per dia com a llista.
  const totesNotes=[]; let totalTests=0;
  Object.values(STATE.forest).forEach(v=>{
    (v.tests||[]).forEach(t=>{
      if(t.nota!==undefined&&t.nota!==null&&t.nota!==""){ totesNotes.push(Number(t.nota)); totalTests++; }
    });
  });
  const notaGlobal=mitjana(totesNotes);

  let h=`<div class="sechead"><div class="n">◒</div><div class="d">Resum del temari, del calendari complert, del temps real d'estudi amb Forest i de la nota dels tests.</div></div>`;

  h+=`<div class="statgrid">
    <div class="statcard"><div class="v">${s.pct}%</div><div class="l">Temari complet</div></div>
    <div class="statcard"><div class="v">${totalSessions}</div><div class="l">Concentracions Forest</div></div>
    <div class="statcard"><div class="v">${mitjanaHores}h</div><div class="l">Mitjana / dia estudiat</div></div>
    <div class="statcard"><div class="v">${notaGlobal!=null?notaGlobal.toFixed(2):'—'}</div><div class="l">Nota mitjana (${totalTests} tests)</div></div>
  </div>`;

  const setmActual=setmanaActual();
  const passades=SETMANES.filter(s2=>s2.s<=setmActual);
  const futures=SETMANES.filter(s2=>s2.s>setmActual);
  const filaSetmana=s2=>{
    const r=resumSetmana(s2);
    return `<div class="statrow"><span class="lbl2">S${s2.s} · ${s2.rang}</span>
      <span class="nums"><span>${r.fets}/${r.total} blocs</span><span>🌲 ${r.sessions}</span><span>${r.hores.toFixed(1)}h</span><span>📝 ${r.numTests?r.notaMitjana.toFixed(1):'—'}</span></span></div>`;
  };
  h+=`<div class="list">`+passades.map(filaSetmana).join("")+`</div>`;
  if(futures.length){
    h+=`<details class="futset"><summary>${futures.length} setmanes futures</summary>
      <div class="list">${futures.map(filaSetmana).join("")}</div></details>`;
  }

  const temaRows=Object.entries(perTema).sort((a,b)=>b[1]-a[1]);
  if(temaRows.length){
    h+=`<div class="weeklbl" style="margin-top:22px">Concentracions Forest per tema</div><div class="list">`;
    temaRows.forEach(([id,min])=>{
      const t=TEMES.find(x=>String(x.id)===String(id));
      h+=`<div class="statrow"><span class="lbl2">T${id} ${t?esc(t.curt):''}</span>
        <span class="nums"><span>${(min/60).toFixed(1)}h</span></span></div>`;
    });
    h+=`</div>`;
  }

  return h;
}
