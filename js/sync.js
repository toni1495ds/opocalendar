import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { $ } from "./helpers.js";
import { STATE } from "./state.js";
import { render } from "./render.js";

let db=null, docRef=null, unsub=null, saveTimer=null;
let firebaseOk=false;
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

export function queueSave(){
  if(!firebaseOk||!docRef){ setSync("err","Sense connexió — canvis locals"); return; }
  setSync("wait","Desant…");
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    try{ await setDoc(docRef,{data:STATE.data,plan:STATE.plan,extra:STATE.extra,updated:Date.now()},{merge:true}); setSync("ok","Sincronitzat"); }
    catch(e){ console.error(e); setSync("err","Error desant"); }
  },600);
}

export function connectDoc(){
  if(!firebaseOk){ setSync("err","Firebase no configurat"); return; }
  docRef=doc(db,"estudi","progres"); // col·lecció "estudi", document "progres"
  setSync("wait","Connectant…");
  unsub=onSnapshot(docRef,(snap)=>{
    if(snap.exists()){
      const d=snap.data();
      // només sobreescrivim si ve del núvol i no estem enmig d'un desat
      STATE.data=d.data||{}; STATE.plan=d.plan||{}; STATE.extra=d.extra||{};
      render();
    }
    setSync("ok","Sincronitzat");
  },(err)=>{ console.error(err); setSync("err","Error de connexió"); });
}
