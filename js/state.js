import { EMPTY } from "./data/etapes.js";
import { ORDRE_ESTAT } from "./data/estats.js";
import { ACTIVITATS } from "./data/activitats.js";
import { queueSave } from "./sync.js";
import { render } from "./render.js";

export let STATE={ data:{}, plan:{}, extra:{}, forest:{} };

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
export function setForest(dayKey,camp,val){
  STATE.forest[dayKey]={...(STATE.forest[dayKey]||{}),[camp]:val}; queueSave();
}
export function toggleTest50(dayKey){
  const cur=STATE.forest[dayKey]||{};
  STATE.forest[dayKey]={...cur,test50:!cur.test50}; queueSave(); render();
}
