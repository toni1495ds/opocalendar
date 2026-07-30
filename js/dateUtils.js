// Totes les dates del calendari d'estudi cauen dins del mateix any (2026),
// per això el mes/dia n'hi ha prou per reconstruir un Date comparable.
export function parseDia(diaStr){
  const m=diaStr.match(/(\d{2})\/(\d{2})/);
  return new Date(2026, parseInt(m[2],10)-1, parseInt(m[1],10));
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
