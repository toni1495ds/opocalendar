import { EMPTY } from "./data/etapes.js";
import { ORDRE_ESTAT } from "./data/estats.js";
import { queueSave } from "./sync.js";
import { render } from "./render.js";

export let STATE={ data:{}, plan:{}, extra:{} };

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
  STATE.plan[k]={...cur,fet:!cur.fet}; queueSave(); render();
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
