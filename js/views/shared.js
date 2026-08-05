import { getT, STATE } from "../state.js";
import { iconSvg, esc } from "../helpers.js";
import { TEMES } from "../data/temes.js";
import { ACTIVITATS } from "../data/activitats.js";

export function etapaHTML(t,e,seg){
  const on=t.s?t.s[e.key]:getT(t.id)[e.key];
  return `<button class="etapa ${on?'on':''} ${seg?'seg':''}" data-act="toggle" data-id="${t.id}" data-key="${e.key}">
    ${iconSvg(e.icona)}${e.curt}${on?' ✓':''}</button>`;
}

// Amaga del desplegable les activitats amb etapa (Lectura, Mapa, Preguntes, Ninja, Classe)
// que ja s'han completat per aquell tema, o que ja estan assignades a un altre bloc
// pendent del mateix tema (una etapa només es fa un cop; no es pot duplicar mentre
// segueixi pendent). Sempre es manté visible la que ja hi ha seleccionada en aquesta cel·la.
function activitatsDisponibles(cel,ownKey){
  if(!cel.tema) return ACTIVITATS;
  const s=getT(cel.tema);
  return ACTIVITATS.filter(a=>{
    if(a.key===cel.act) return true;
    if(!a.etapa) return true;
    if(s[a.etapa]) return false;
    return !Object.entries(STATE.plan).some(([k,c])=>
      k!==ownKey && c && !c.fet && String(c.tema)===String(cel.tema) && c.act===a.key);
  });
}

export function blocHTML(k,label,dayKey,extraIdx){
  const cel=STATE.plan[k]||{};
  const act=ACTIVITATS.find(a=>a.key===cel.act);
  const fet=!!cel.fet;
  return `<div class="bloc ${fet?'fet':''}" draggable="true" data-dragkey="${k}" style="border-left-color:${act?act.color:'var(--border)'}">
    <div class="blochead">
      <input class="bl" data-act="cel" data-k="${k}" data-camp="label" value="${esc(cel.label ?? label)}" />
      <span style="display:flex;gap:4px;align-items:center">
        <button class="fetbtn ${fet?'on':''}" data-act="fet" data-k="${k}" title="Marca com fet"></button>
        ${extraIdx!=null
          ?`<button class="rmbloc" data-act="rmbloc" data-k="${dayKey}" data-idx="${extraIdx}" title="Elimina aquest bloc">×</button>`
          :`<button class="rmbloc" data-act="rmbase" data-k="${dayKey}" data-bloc="${label}" title="Elimina aquest bloc">×</button>`}
      </span>
    </div>
    <select data-act="cel" data-k="${k}" data-camp="tema">
      <option value="">— Tema —</option>
      ${TEMES.map(t=>`<option value="${t.id}" ${String(cel.tema)===String(t.id)?'selected':''}>T${t.id} ${esc(t.curt)}</option>`).join("")}
    </select>
    <select data-act="cel" data-k="${k}" data-camp="act" style="color:${act?act.color:'var(--text)'};font-weight:${act?600:400}">
      <option value="">— Activitat —</option>
      ${activitatsDisponibles(cel,k).map(a=>`<option value="${a.key}" ${cel.act===a.key?'selected':''}>${a.key}</option>`).join("")}
    </select>
    ${forestHTML(cel,k)}
  </div>`;
}

const DURACIONS_FOREST=[30,45,50,60];

// Cada clic afegeix una sessió Forest real d'aquella durada a la targeta; el
// comptador vermell de dalt a la dreta mostra quantes en portes d'aquell tipus
// (clicar-lo en treu una). Es guarden totes (no només un recompte agregat)
// perquè la suma de minuts a Estadístiques sigui real, no una suposició.
function forestHTML(cel,k){
  const sessions=Array.isArray(cel.forest)?cel.forest:[];
  return `<div class="blocforest"><div class="foresttrees">
    ${DURACIONS_FOREST.map(m=>{
      const n=sessions.filter(s=>s===m).length;
      return `<button class="treebtn" data-act="addforest" data-k="${k}" data-min="${m}" title="Afegeix una sessió de ${m} min">🌲${m}${n>0?`<span class="treebadge" data-act="rmforest" data-k="${k}" data-min="${m}" title="Treu una sessió de ${m} min">${n}</span>`:''}</button>`;
    }).join("")}
  </div></div>`;
}

const OPCIONS_PREGUNTES=[20,30,40,50,60,70,80];

// Els tests solen ser globals (no lligats a un tema concret), així que es guarden
// per dia com una llista: pots fer-ne més d'un el mateix dia (p.ex. 2-3 tests).
export function testsHTML(dayKey){
  const fv=STATE.forest[dayKey]||{};
  const tests=fv.tests||[];
  let h=`<div class="testlist">`;
  tests.forEach((t,i)=>{
    h+=`<div class="testrow">
      <span>📝</span>
      <select data-act="test" data-k="${dayKey}" data-idx="${i}" data-camp="preguntes">
        ${OPCIONS_PREGUNTES.map(o=>`<option value="${o}" ${Number(t.preguntes)===o?'selected':''}>${o} preg.</option>`).join("")}
      </select>
      <input type="number" min="0" max="10" step="0.01" inputmode="decimal" placeholder="Nota" data-act="test" data-k="${dayKey}" data-idx="${i}" data-camp="nota" value="${t.nota??''}" />
      <button class="rmtest" data-act="rmtest" data-k="${dayKey}" data-idx="${i}" title="Elimina aquest test">×</button>
    </div>`;
  });
  if(tests.length===0)h+=`<div class="testempty">Cap test avui.</div>`;
  h+=`</div><button class="addtest" data-act="addtest" data-k="${dayKey}">+ Afegir test</button>`;
  return h;
}
