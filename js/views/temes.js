import { TEMES } from "../data/temes.js";
import { ETAPES } from "../data/etapes.js";
import { ESTATS, ORDRE_ESTAT } from "../data/estats.js";
import { esc } from "../helpers.js";
import { getT } from "../state.js";
import { etapaHTML } from "./shared.js";

let ordreTemes="prioritat", filtreTemes="tots";
export function setOrdreTemes(v){ ordreTemes=v; }
export function setFiltreTemes(v){ filtreTemes=v; }

export function viewTemes(){
  let arr=TEMES.map(t=>({...t,s:getT(t.id)}));
  if(filtreTemes==="pendents")arr=arr.filter(t=>t.s.estat!=="verd");
  else if(filtreTemes==="nous")arr=arr.filter(t=>t.nou);
  if(ordreTemes==="prioritat")arr.sort((a,b)=>((b.preg==null?-1:b.preg)-(a.preg==null?-1:a.preg)));
  else arr.sort((a,b)=>a.id-b.id);
  let h=`<div class="controls"><span class="lbl">Ordena</span>
    <button class="cbtn ${ordreTemes==='prioritat'?'on':''}" data-act="ordre" data-v="prioritat">Prioritat</button>
    <button class="cbtn ${ordreTemes==='numero'?'on':''}" data-act="ordre" data-v="numero">Número</button>
    <span class="sep"></span>
    <button class="cbtn ${filtreTemes==='tots'?'on':''}" data-act="filtre" data-v="tots">Tots</button>
    <button class="cbtn ${filtreTemes==='pendents'?'on':''}" data-act="filtre" data-v="pendents">No dominats</button>
    <button class="cbtn ${filtreTemes==='nous'?'on':''}" data-act="filtre" data-v="nous">Nous</button></div>`;
  h+=`<div class="list">`;
  arr.forEach(t=>{
    const fetes=ETAPES.filter(e=>t.s[e.key]).length;
    h+=`<div class="item" style="border-left:3px solid ${ESTATS[t.s.estat].color}">
      <div class="top"><div style="min-width:0">
        <div class="meta"><span class="tid">T${t.id}</span>${t.nou?'<span class="nou">NOU</span>':''}${t.preg!=null?`<span class="preg">${t.preg} preg.</span>`:'<span class="preg">sense ref.</span>'}<span class="preg">${fetes}/5</span></div>
        <div class="tnom" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t.nom)}</div></div>
        <div class="estats">${ORDRE_ESTAT.map(es=>`<button class="${t.s.estat===es?'on':''}" data-act="estat" data-id="${t.id}" data-v="${es}" title="${ESTATS[es].nom}" style="background:${ESTATS[es].color};opacity:${t.s.estat===es?1:.3}"></button>`).join("")}</div>
      </div><div class="etapes">${ETAPES.map(e=>etapaHTML(t,e,false)).join("")}</div></div>`;
  });
  h+=`</div>`; return h;
}
