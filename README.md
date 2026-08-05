# Seguiment d'estudi · Bomber 81/26

App d'una sola pàgina (sense build step) per fer seguiment del temari, prioritzar temes, planificar el calendari d'estudi (i el dia d'avui, amb el mateix editor) i registrar minuts reals amb Forest per targeta, amb sincronització via Firebase entre dispositius.

En viu: https://toni1495ds.github.io/opocalendar/

## Estructura

```
index.html            Punt d'entrada: només marcatge, referencia css/ i js/
css/
  main.css             Tots els estils
js/
  config.js            Credencials Firebase + codi d'accés
  helpers.js           Utilitats petites (esc, $, iconSvg) sense estat
  dateUtils.js         Parseig de dates del calendari + "quin dia és avui"
  data/                Contingut estàtic del temari (no canvia en temps d'execució)
    temes.js
    etapes.js
    estats.js
    activitats.js
    setmanes.js
    dossier.js
  state.js             Estat global (STATE: data/plan/extra/forest/amagats) + mutacions,
                       incloent el trasllat automàtic de blocs no fets al dia següent
  stats.js             Càlculs derivats de l'estat (progrés, dies fins l'examen)
  sync.js              Tot el que toca Firebase (connectar, desar sense merge, escoltar
                       canvis, forçar el desat pendent si es tanca/recarrega la pestanya)
  render.js            Dispatcher de vistes + actualització de la capçalera
  views/                Una vista = un fitxer = una pestanya de la UI
    avui.js             Editor de blocs del dia d'avui (afegir/editar/esborrar targetes),
                        igual que calendari.js però només per al dia actual
    calendari.js         Planificació setmanal per blocs, amb drag&drop per reordenar-los
    temes.js              Llista completa del temari, amb filtres i ordre (número/
                          prioritat/hores invertides amb Forest)
    prioritat.js          Dossier ØPT1M ordenat per preguntes caigudes
    estadistiques.js      Resum: % temari, concentracions Forest (totals i per tema),
                          nota mitjana dels tests, setmanes futures col·lapsades
    shared.js             Marcatge compartit entre vistes: la targeta de bloc (tema +
                          activitat + sessions Forest), la llista de tests del dia i
                          els botons d'etapa
  events.js            Cablejat d'esdeveniments DOM -> mutacions d'estat (clics, canvis
                       de formulari i drag&drop)
  auth.js              Porta d'accés (codi + sessionStorage, entra sol en arribar als
                       4 dígits)
  main.js              Entry point: wireEvents() + wireAuth()
```

## Idea darrere la separació

Cada capa es pot tocar sense entendre les altres:

- Vols canviar el temari o afegir un tema nou → només `js/data/`.
- Vols canviar l'aparença → només `css/main.css`.
- Vols canviar com es desa/sincronitza → només `js/sync.js`.
- Vols afegir una pestanya nova → un fitxer nou a `js/views/` + una línia a `render.js` i `index.html`.
- Vols canviar la lògica de negoci (com es calcula el progrés) → només `js/stats.js`.

## Executar en local

Cal servir els fitxers per http (els mòduls ES no funcionen amb `file://`). Amb l'extensió Live Server de VS Code (ja configurada a `.vscode/settings.json`, port 5501) n'hi ha prou amb "Open with Live Server" sobre `index.html`.

## Configuració

`js/config.js` ja té la configuració real del projecte Firebase `opocalendar-3ef5a` i el codi d'accés (`CODI_ACCES`). Les regles de Firestore obren només el document `estudi/progres` (`allow read, write: if true`).

Important: el codi d'accés és protecció superficial, no seguretat real — és visible en text pla per a qui obri `js/config.js` (el repositori és públic), i les regles de Firestore no exigeixen cap autenticació. Només evita que algú que trobi l'enllaç per casualitat vegi les dades d'un cop d'ull.

## Desplegament

`main` es publica automàticament a GitHub Pages a cada `git push`. No cal cap pas extra.

## Idees futures (to-do)

- **Importar CSV de Forest**: l'app Forest no té API pública ni integració en temps real, però sí permet exportar un CSV de l'historial de sessions des de la mateixa app. Es podria afegir un botó "Importa CSV" que llegeixi aquest fitxer i afegeixi soles les sessions (amb la seva durada real) a la targeta corresponent, en lloc de clicar-les a mà una per una.
