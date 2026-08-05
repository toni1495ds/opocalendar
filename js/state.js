import { EMPTY } from "./data/etapes.js";
import { ORDRE_ESTAT } from "./data/estats.js";
import { ACTIVITATS } from "./data/activitats.js";
import { SETMANES, BLOCS } from "./data/setmanes.js";
import { parseDia, avui } from "./dateUtils.js";
import { queueSave } from "./sync.js";
import { render } from "./render.js";

export let STATE={ data:{}, plan:{}, extra:{}, forest:{}, amagats:{} };

export const getT=(id)=> STATE.data[id] || EMPTY;

export function toggleEtapa(id,key){
  const cur={...EMPTY,...(STATE.data[id]||{})}; cur[key]=!cur[key];
  STATE.data[id]=cur; queueSave(); render();
}
export function setEstat(id,estat){
  STATE.data[id]={...EMPTY,...(STATE.data[id]||{}),estat}; queueSave(); render();
}
export function ciclarEstat(id){
  const cur=getT(id); const i=ORDRE_ESTAT.indexOf(cur.estat||"vermell");
  setEstat(id,ORDRE_ESTAT[(i+1)%ORDRE_ESTAT.length]);
}
export function setCel(k,camp,val){
  STATE.plan[k]={...(STATE.plan[k]||{}),[camp]:val}; queueSave();
}
export function toggleFet(k){
  const cur=STATE.plan[k]||{};
  const nowFet=!cur.fet;
  STATE.plan[k]={...cur,fet:nowFet};
  // Si el bloc té tema + una activitat que correspon a una etapa (Lectura, Mapa...),
  // marcar-lo com fet actualitza també el progrés d'aquell tema a la pestanya Temes.
  if(nowFet && cur.tema){
    const act=ACTIVITATS.find(a=>a.key===cur.act);
    if(act && act.etapa){
      const temaData={...EMPTY,...(STATE.data[cur.tema]||{})};
      if(!temaData[act.etapa]){ temaData[act.etapa]=true; STATE.data[cur.tema]=temaData; }
    }
  }
  queueSave(); render();
}
export function addExtraBloc(dayKey){
  STATE.extra[dayKey]=(STATE.extra[dayKey]||0)+1; queueSave(); render();
}
export function removeExtraBloc(dayKey,idx){
  const count=STATE.extra[dayKey]||0;
  for(let i=idx;i<count-1;i++){ STATE.plan[`${dayKey}-extra${i}`]=STATE.plan[`${dayKey}-extra${i+1}`]; }
  delete STATE.plan[`${dayKey}-extra${count-1}`];
  STATE.extra[dayKey]=Math.max(0,count-1);
  queueSave(); render();
}
export function addForestSession(k,min){
  const cur=STATE.plan[k]||{};
  const forest=[...(Array.isArray(cur.forest)?cur.forest:[]),min];
  STATE.plan[k]={...cur,forest}; queueSave(); render();
}
export function removeForestSession(k,min){
  const cur=STATE.plan[k]||{};
  const forest=Array.isArray(cur.forest)?[...cur.forest]:[];
  const idx=forest.indexOf(min);
  if(idx!==-1)forest.splice(idx,1);
  STATE.plan[k]={...cur,forest}; queueSave(); render();
}
export function addTest(dayKey){
  const cur=STATE.forest[dayKey]||{};
  STATE.forest[dayKey]={...cur,tests:[...(cur.tests||[]),{preguntes:40,nota:""}]};
  queueSave(); render();
}
export function removeTest(dayKey,idx){
  const cur=STATE.forest[dayKey]||{};
  STATE.forest[dayKey]={...cur,tests:(cur.tests||[]).filter((_,i)=>i!==idx)};
  queueSave(); render();
}
export function setTestField(dayKey,idx,camp,val){
  const cur=STATE.forest[dayKey]||{};
  const tests=[...(cur.tests||[])];
  tests[idx]={...tests[idx],[camp]:val};
  STATE.forest[dayKey]={...cur,tests}; queueSave();
}
// Matí/Tarda/Vespre són slots fixos per defecte, però es poden eliminar igual que
// els blocs extra; queden marcats a STATE.amagats per no tornar-los a mostrar aquell dia.
export function removeBaseBloc(dayKey,label){
  const cur=STATE.amagats[dayKey]||[];
  if(!cur.includes(label))STATE.amagats[dayKey]=[...cur,label];
  delete STATE.plan[`${dayKey}-${label}`];
  queueSave(); render();
}
export function swapBlocs(keyA,keyB){
  const a=STATE.plan[keyA], b=STATE.plan[keyB];
  if(b)STATE.plan[keyA]={...b}; else delete STATE.plan[keyA];
  if(a)STATE.plan[keyB]={...a}; else delete STATE.plan[keyB];
  queueSave(); render();
}

function diesFlat(){
  const out=[];
  SETMANES.forEach(s=>{ s.dies.forEach((dia,di)=>out.push({key:`${s.s}-${di}`,date:parseDia(dia)})); });
  return out;
}
const blocBuit=(cel)=>!cel||(!cel.tema&&!cel.act&&!(Array.isArray(cel.forest)&&cel.forest.length));

function blocsBaseActius(dayKey){
  const amagats=STATE.amagats[dayKey]||[];
  return BLOCS.filter(b=>!amagats.includes(b));
}
function clausDia(dayKey){
  const keys=blocsBaseActius(dayKey).map(b=>`${dayKey}-${b}`);
  const extraCount=STATE.extra[dayKey]||0;
  for(let e=0;e<extraCount;e++)keys.push(`${dayKey}-extra${e}`);
  return keys;
}
// Evita crear una targeta duplicada: si el dia destí ja té pendent el mateix
// tema+activitat, no cal arrossegar-hi una còpia més.
function jaHiEs(dayKey,cel){
  if(!cel.tema||!cel.act)return false;
  return clausDia(dayKey).some(k=>{
    const c=STATE.plan[k];
    return c&&!c.fet&&String(c.tema)===String(cel.tema)&&c.act===cel.act;
  });
}

// Si un bloc d'un dia ja passat s'ha quedat sense marcar com fet (però té tema o
// activitat assignats), el trasllada al primer forat lliure del dia següent perquè
// no es perdi. Ho fa en cascada, així arrossega els pendents fins avui en una sola passada.
export function rolloverUnfinished(){
  const dies=diesFlat(); const today=avui(); let canviat=false;
  for(let i=0;i<dies.length-1;i++){
    const {key:dayKey,date}=dies[i];
    if(date>=today)break;
    const next=dies[i+1];
    clausDia(dayKey).forEach(k=>{
      const cel=STATE.plan[k];
      if(cel&&(cel.tema||cel.act)&&!cel.fet){
        if(jaHiEs(next.key,cel)){ delete STATE.plan[k]; canviat=true; return; }
        let dest=blocsBaseActius(next.key).map(b=>`${next.key}-${b}`).find(nk=>blocBuit(STATE.plan[nk]));
        if(!dest){
          const idx=STATE.extra[next.key]||0;
          STATE.extra[next.key]=idx+1;
          dest=`${next.key}-extra${idx}`;
        }
        STATE.plan[dest]={...cel,fet:false};
        delete STATE.plan[k];
        canviat=true;
      }
    });
  }
  if(canviat)queueSave();
  return canviat;
}
