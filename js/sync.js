import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { $ } from "./helpers.js";
import { STATE, rolloverUnfinished } from "./state.js";
import { render } from "./render.js";

let db=null, docRef=null, unsub=null, saveTimer=null;
let firebaseOk=false, primerSnapshot=true;
try {
  const fbApp = initializeApp(firebaseConfig);
  db = getFirestore(fbApp);
  firebaseOk = true;
} catch(e){ console.warn("Firebase no configurat encara:", e); }

let hideTimer=null;
function setSync(cls,txt){
  const bar=$("#syncbar"),d=$("#syncdot"),t=$("#synctext");
  if(d){d.className="";if(cls)d.classList.add(cls);}
  if(t)t.textContent=txt;
  clearTimeout(hideTimer);
  if(!bar)return;
  if(cls==="ok"){ hideTimer=setTimeout(()=>bar.classList.add("hide"),1500); }
  else{ bar.classList.remove("hide"); }
}

async function desaAra(){
  clearTimeout(saveTimer); saveTimer=null;
  // Sense merge: STATE sempre conté l'estat complet i actual, i cal que les
  // claus esborrades localment (targetes eliminades) també desapareguin al núvol.
  // Amb merge:true, Firestore fa un merge profund dels mapes niats i mai esborra
  // una clau que simplement no s'envia, així que una targeta esborrada tornava a aparèixer.
  try{ await setDoc(docRef,{data:STATE.data,plan:STATE.plan,extra:STATE.extra,forest:STATE.forest,amagats:STATE.amagats,updated:Date.now()}); setSync("ok","Sincronitzat"); }
  catch(e){ console.error(e); setSync("err","Error desant"); }
}

export function queueSave(){
  if(!firebaseOk||!docRef){ setSync("err","Sense connexió — canvis locals"); return; }
  setSync("wait","Desant…");
  clearTimeout(saveTimer);
  saveTimer=setTimeout(desaAra,600);
}

// Si la pestanya es tanca, es recarrega o passa a segon pla mentre encara hi ha
// un desat pendent (per exemple, per un auto-reload d'un live server), l'enviem
// de seguida en lloc d'esperar els 600ms i perdre'l.
function flushPendent(){
  if(saveTimer&&docRef)desaAra();
}
window.addEventListener("pagehide",flushPendent);
window.addEventListener("beforeunload",flushPendent);
document.addEventListener("visibilitychange",()=>{ if(document.hidden)flushPendent(); });

export function connectDoc(){
  if(!firebaseOk){ setSync("err","Firebase no configurat"); return; }
  docRef=doc(db,"estudi","progres"); // col·lecció "estudi", document "progres"
  setSync("wait","Connectant…");
  unsub=onSnapshot(docRef,(snap)=>{
    if(snap.exists()){
      const d=snap.data();
      // només sobreescrivim si ve del núvol i no estem enmig d'un desat
      STATE.data=d.data||{}; STATE.plan=d.plan||{}; STATE.extra=d.extra||{}; STATE.forest=d.forest||{}; STATE.amagats=d.amagats||{};
      if(primerSnapshot){ primerSnapshot=false; rolloverUnfinished(); }
      render();
    }
    setSync("ok","Sincronitzat");
  },(err)=>{ console.error(err); setSync("err","Error de connexió"); });
}
