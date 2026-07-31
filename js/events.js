import { $ } from "./helpers.js";
import { toggleEtapa, ciclarEstat, setEstat, setCel, toggleFet, addExtraBloc, removeExtraBloc, setForest } from "./state.js";
import { render, setVista } from "./render.js";
import { setOrdreTemes, setFiltreTemes } from "./views/temes.js";
import { setBlocPrio } from "./views/prioritat.js";
import { setSetmSel } from "./views/calendari.js";

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
  });

  $("#view").addEventListener("change",e=>{
    const el=e.target.closest("[data-act]"); if(!el)return;
    const a=el.dataset.act;
    if(a==="cel"){ setCel(el.dataset.k,el.dataset.camp,el.value); render(); }
    else if(a==="forest"){ setForest(el.dataset.k,el.dataset.camp,el.value); render(); }
  });
}
