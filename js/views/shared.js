import { getT } from "../state.js";
import { iconSvg } from "../helpers.js";

export function etapaHTML(t,e,seg){
  const on=t.s?t.s[e.key]:getT(t.id)[e.key];
  return `<button class="etapa ${on?'on':''} ${seg?'seg':''}" data-act="toggle" data-id="${t.id}" data-key="${e.key}">
    ${iconSvg(e.icona)}${e.curt}${on?' ✓':''}</button>`;
}
