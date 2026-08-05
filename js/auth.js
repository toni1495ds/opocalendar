import { $ } from "./helpers.js";
import { CODI_ACCES } from "./config.js";
import { render } from "./render.js";
import { connectDoc } from "./sync.js";

function obrirApp(){
  $("#gate").classList.add("hidden");
  $("#app").classList.remove("hidden");
  render();
  connectDoc();
}

function provarCodi(){
  const v=$("#gatecode").value.trim();
  if(v===CODI_ACCES){ sessionStorage.setItem("estudi_ok","1"); obrirApp(); }
  else { $("#gateerr").textContent="Codi incorrecte."; $("#gatecode").value=""; }
}

export function wireAuth(){
  $("#gatebtn").addEventListener("click",provarCodi);
  $("#gatecode").addEventListener("keydown",e=>{ if(e.key==="Enter")provarCodi(); });
  // Entra automàticament en arribar a la llargada del codi, sense haver de clicar "Entrar".
  $("#gatecode").addEventListener("input",e=>{
    if(e.target.value.trim().length>=CODI_ACCES.length)provarCodi();
  });

  // si ja hem entrat en aquesta sessió, obre directe
  if(sessionStorage.getItem("estudi_ok")==="1"){ obrirApp(); }
  else { $("#gatecode").focus(); }
}
