import { $ } from "./helpers.js";
import { toggleEtapa, ciclarEstat, setEstat, setCel, toggleFet, addExtraBloc, removeExtraBloc, addForestSession, removeForestSession, addTest, removeTest, setTestField, removeBaseBloc, swapBlocs } from "./state.js";
import { render, setVista } from "./render.js";
import { setOrdreTemes, setFiltreTemes } from "./views/temes.js";
import { setBlocPrio } from "./views/prioritat.js";
import { setSetmSel } from "./views/calendari.js";

const diaDe=(k)=>k.split("-").slice(0,-1).join("-");

function wireDragDrop(){
  const view=$("#view");
  let dragKey=null;
  view.addEventListener("dragstart",e=>{
    const el=e.target.closest("[data-dragkey]"); if(!el)return;
    dragKey=el.dataset.dragkey;
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text/plain",dragKey);
    el.classList.add("dragging");
  });
  view.addEventListener("dragover",e=>{
    const el=e.target.closest("[data-dragkey]"); if(!el)return;
    e.preventDefault();
    el.classList.add("dragover");
  });
  view.addEventListener("dragleave",e=>{
    const el=e.target.closest("[data-dragkey]"); if(!el)return;
    el.classList.remove("dragover");
  });
  view.addEventListener("drop",e=>{
    const el=e.target.closest("[data-dragkey]"); if(!el)return;
    e.preventDefault();
    el.classList.remove("dragover");
    const targetKey=el.dataset.dragkey;
    const srcKey=dragKey||e.dataTransfer.getData("text/plain");
    if(srcKey&&targetKey&&srcKey!==targetKey&&diaDe(srcKey)===diaDe(targetKey)){
      swapBlocs(srcKey,targetKey);
    }
    dragKey=null;
  });
  view.addEventListener("dragend",e=>{
    const el=e.target.closest("[data-dragkey]"); if(!el)return;
    el.classList.remove("dragging");
  });
}

export function wireEvents(){
  $("#tabs").addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b)return;
    setVista(b.dataset.v); render();
  });

  $("#view").addEventListener("click",e=>{
    const el=e.target.closest("[data-act]"); if(!el)return;
    const a=el.dataset.act;
    if(a==="toggle")toggleEtapa(+el.dataset.id,el.dataset.key);
    else if(a==="cicle")ciclarEstat(+el.dataset.id);
    else if(a==="estat")setEstat(+el.dataset.id,el.dataset.v);
    else if(a==="ordre"){setOrdreTemes(el.dataset.v);render();}
    else if(a==="filtre"){setFiltreTemes(el.dataset.v);render();}
    else if(a==="bloc"){setBlocPrio(el.dataset.v);render();}
    else if(a==="setm"){setSetmSel(+el.dataset.v);render();}
    else if(a==="fet")toggleFet(el.dataset.k);
    else if(a==="addbloc")addExtraBloc(el.dataset.k);
    else if(a==="rmbloc")removeExtraBloc(el.dataset.k,+el.dataset.idx);
    else if(a==="rmbase")removeBaseBloc(el.dataset.k,el.dataset.bloc);
    else if(a==="addforest")addForestSession(el.dataset.k,+el.dataset.min);
    else if(a==="rmforest")removeForestSession(el.dataset.k,+el.dataset.min);
    else if(a==="addtest")addTest(el.dataset.k);
    else if(a==="rmtest")removeTest(el.dataset.k,+el.dataset.idx);
  });

  $("#view").addEventListener("change",e=>{
    const el=e.target.closest("[data-act]"); if(!el)return;
    const a=el.dataset.act;
    if(a==="cel"){ setCel(el.dataset.k,el.dataset.camp,el.value); render(); }
    else if(a==="test"){ setTestField(el.dataset.k,+el.dataset.idx,el.dataset.camp,el.value); render(); }
  });

  wireDragDrop();

  $("#btn-logout").addEventListener("click",()=>{
    sessionStorage.removeItem("estudi_ok");
    location.reload();
  });
}
