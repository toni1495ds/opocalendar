# Seguiment d'estudi · Bomber 81/26

App d'una sola pàgina (sense build step) per fer seguiment del temari, prioritzar temes, planificar el calendari d'estudi i registrar minuts reals amb Forest, amb sincronització via Firebase entre dispositius.

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
  state.js             Estat global (STATE: data/plan/extra/forest) + mutacions
  stats.js             Càlculs derivats de l'estat (progrés, dies fins l'examen)
  sync.js              Tot el que toca Firebase (connectar, desar, escoltar canvis)
  render.js            Dispatcher de vistes + actualització de la capçalera
  views/                Una vista = un fitxer = una pestanya de la UI
    avui.js             El que toca fer avui (segons el planificat al calendari)
    calendari.js         Planificació setmanal per blocs + registre Forest
    temes.js              Llista completa del temari amb filtres i ordre
    prioritat.js          Dossier ØPT1M ordenat per preguntes caigudes
    estadistiques.js      Resum: % temari, concentracions, hores, blocs fets/setmana
    shared.js             Marcatge compartit entre vistes (botons d'etapa)
  events.js            Cablejat d'esdeveniments DOM -> mutacions d'estat
  auth.js              Porta d'accés (codi + sessionStorage)
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

`js/config.js` ja té la configuració real del projecte Firebase `opocalendar-3ef5a` i el codi d'accés. Les regles de Firestore obren només el document `estudi/progres` (`allow read, write: if true`).

## Desplegament

`main` es publica automàticament a GitHub Pages a cada `git push`. No cal cap pas extra.

## Idees futures (to-do)

- **Importar CSV de Forest**: l'app Forest no té API pública ni integració en temps real, però sí permet exportar un CSV de l'historial de sessions des de la mateixa app. Es podria afegir un botó "Importa CSV" a Calendari/Estadístiques que llegeixi aquest fitxer i ompli soles les concentracions i minuts de cada dia, en lloc d'escriure-ho a mà.
