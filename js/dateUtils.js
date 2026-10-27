// El calendari d'estudi va de juliol/2026 a gener/2027, així que el mes sol
// no basta per saber l'any: mesos de gener a juny cauen el 2027, la resta el 2026.
export function parseDia(diaStr){
  const m=diaStr.match(/(\d{2})\/(\d{2})/);
  const mes=parseInt(m[2],10), dia=parseInt(m[1],10);
  const any=mes<=6?2027:2026;
  return new Date(any, mes-1, dia);
}
export function avui(){
  const d=new Date(); d.setHours(0,0,0,0); return d;
}

// Troba a quina setmana/dia del calendari cau la data d'avui.
// Retorna null si avui és fora del període de temari (abans o després).
export function trobaAvui(SETMANES){
  const today=avui();
  for(const s of SETMANES){
    for(let di=0; di<s.dies.length; di++){
      if(parseDia(s.dies[di]).getTime()===today.getTime()) return {setmana:s.s,di,dia:s.dies[di]};
    }
  }
  return null;
}
