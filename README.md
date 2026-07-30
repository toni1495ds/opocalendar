# Seguiment d'estudi · Bomber 81/26

App d'una sola pàgina (sense build step) per fer seguiment del temari, prioritzar temes i planificar el calendari d'estudi, amb sincronització opcional via Firebase.

## Estructura

```
estudi.html          Punt d'entrada: només marcatge, referencia css/ i js/
css/
  main.css           Tots els estils
js/
  config.js          Credencials Firebase + codi d'accés (l'únic fitxer "sensible")
  helpers.js          Utilitats petites (esc, $, iconSvg) sense estat
  data/               Contingut estàtic del temari (no canvia en temps d'execució)
    temes.js
    etapes.js
    estats.js
    activitats.js
    setmanes.js
    dossier.js
  state.js            Estat global (STATE) + mutacions (toggleEtapa, setEstat, setCel...)
  stats.js             Càlculs derivats de l'estat (progrés, dies, recomanacions)
  sync.js              Tot el que toca Firebase (connectar, desar, escoltar canvis)
  render.js            Dispatcher de vistes + actualització de la capçalera
  views/               Una vista = un fitxer = una pestanya de la UI
    avui.js
    temes.js
    prioritat.js
    calendari.js
    shared.js          Marcatge compartit entre vistes (botons d'etapa)
  events.js            Cablejat d'esdeveniments DOM -> mutacions d'estat
  auth.js              Porta d'accés (codi + sessionStorage)
  main.js              Entry point: wireEvents() + wireAuth()
```

## Idea darrere la separació

Cada capa es pot tocar sense entendre les altres:

- Vols canviar el temari o afegir un tema nou → només `js/data/`.
- Vols canviar l'aparença → només `css/main.css`.
- Vols canviar com es desa/sincronitza → només `js/sync.js`.
- Vols afegir una pestanya nova → un fitxer nou a `js/views/` + una línia a `render.js` i `estudi.html`.
- Vols canviar la lògica de negoci (com es calcula el progrés) → només `js/stats.js`.

## Executar en local

Cal servir els fitxers per http (els mòduls ES no funcionen amb `file://`). Amb l'extensió Live Server de VS Code (ja configurada a `.vscode/settings.json`, port 5501) n'hi ha prou amb "Open with Live Server" sobre `estudi.html`.

## Configuració

Abans de fer servir la sincronització, edita `js/config.js`:
- Enganxa la config del teu projecte Firebase.
- Canvia `CODI_ACCES` pel codi d'accés que vulguis.

Si publiques aquest repositori en obert, considera no versionar `js/config.js` amb credencials reals (afegeix-lo a `.gitignore` i distribueix un `config.example.js`).
