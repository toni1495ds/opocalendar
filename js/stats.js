import { TEMES } from "./data/temes.js";
import { ETAPES } from "./data/etapes.js";
import { getT, STATE } from "./state.js";

export const EXAM_DATA_DEFECTE="2027-01-30";

export function examData(){
  return STATE.config.examData || EXAM_DATA_DEFECTE;
}
export function diesExamen(){
  const [y,m,d]=examData().split("-").map(Number);
  const ex=new Date(y,m-1,d); const a=new Date(); a.setHours(0,0,0,0);
  return Math.max(0,Math.round((ex-a)/86400000));
}

export function stats(){
  let fetes=0; const total=TEMES.length*ETAPES.length; let d=0,g=0,p=0;
  TEMES.forEach(t=>{ const s=getT(t.id); ETAPES.forEach(e=>{if(s[e.key])fetes++}); if(s.estat==="verd")d++; else if(s.estat==="groc")g++; else p++; });
  return {fetes,total,d,g,p,pct:Math.round(fetes/total*100)};
}
