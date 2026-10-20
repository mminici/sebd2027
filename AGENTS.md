# SEBD 2027 — sito della conferenza

Sito statico di consultazione per il 35th Symposium on Advanced Database Systems (SEBD 2027), Otranto (Lecce, Puglia), sede: Basiliani Hotel SPA. Stack: Astro + Tailwind CSS. Lingua del sito: inglese (lingua ufficiale della conferenza). Pubblico: ricercatori di basi di dati, accademia e industria, che cercano velocemente date, call, programma e logistica.

## Pagine

Stessa struttura informativa di sebd2026.dii.univpm.it (solo la struttura: non copiare codice, testi o immagini):

- `/` Home: hero (nome, edizione, date, luogo), About, Important dates, anteprima della sede, anteprima di Otranto, Supported by
- `/call-for-papers`, `/important-dates`, `/committees`, `/keynotes`, `/program`, `/registration`
- `/venue` Basiliani Hotel SPA: foto, indirizzo, descrizione, pulsante "Get directions", come arrivare (aereo, treno, auto)
- `/otranto` la città: centro storico, Cattedrale e mosaico pavimentale, Castello Aragonese, Laghi Alimini, dintorni (Lecce)
- `/accommodation` eventuali convenzioni

## Contenuti separati dal codice

Tutti i dati modificabili stanno in `src/data/*.yaml` (conference, dates, committees, keynotes, sponsors, venue) e i testi lunghi in `src/content/` come Markdown. Le pagine leggono da lì: per aggiornare una data o un nome non si tocca mai un componente. Un'informazione compare in un solo file.

## Design: Material Design 3, ispirato a Otranto

Componenti e comportamento Material 3 (top app bar, navigation drawer su mobile, filled/tonal/outlined button, superfici tonali al posto delle ombre grigie, stati hover/focus/pressed con state layer). Niente libreria di componenti: token CSS + Tailwind.

Palette (token CSS su `:root`, con varianti dark sotto `prefers-color-scheme: dark`):

- Adriatico `#0E4C66` — primary (il mare di Otranto)
- Alimini `#3FA7A3` — secondary, container `#D3EEEC`
- Pietra leccese `#D9B97A` — tertiary e tessere decorative, container `#F3E6C8`
- Melograno `#9E1B32` — accento raro (rimando alla SPA "Il Melograno", scadenze imminenti)
- Inchiostro `#14262F` — testo; superficie `#F6FAFB` (chiara e fredda, non crema)

Tipografia: Roboto Serif (variabile) per titoli e numeri delle date; Roboto Flex (variabile) per testo e interfaccia. Font self-hosted con `@fontsource-variable`. Sentence case ovunque, niente etichette in maiuscolo, righe di testo sotto gli 80 caratteri.

Elemento distintivo, usato in un solo posto: le "tessere", piccoli quadrati ispirati al mosaico pavimentale della Cattedrale di Otranto. Formano la timeline delle Important dates (una tessera per scadenza: piena se passata, contornata se futura, color melograno se entro 14 giorni) e una sottile fascia sotto l'hero. Tutto il resto resta sobrio e ordinato. Un'unica animazione all'apertura dell'hero; nessuna animazione di comparsa sulle sezioni.

## Regole tecniche

- Il sito viene servito sia da `https://<utente>.github.io/sebd2027/` sia da `https://sebd2027.icar.cnr.it/`: link interni, immagini e asset passano sempre da `import.meta.env.BASE_URL`, mai percorsi assoluti scritti a mano.
- Nessuna richiesta a server esterni: niente CDN, Google Fonts, Google Maps embed, analytics o script di terze parti (così non serve un banner cookie). Mappa = link "Get directions" a Google Maps o OpenStreetMap. Icone Material Symbols come SVG inline, solo quelle usate.
- Immagini in `src/assets/`, ottimizzate con `<Image />` di `astro:assets`, sempre con `alt` descrittivo e credito fotografico visibile. Usare solo foto proprie, concesse dall'hotel o con licenza aperta (es. Wikimedia Commons) e attribuzione.
- Accessibilità: contrasto WCAG AA, focus da tastiera visibile, drawer navigabile da tastiera, `prefers-reduced-motion` rispettato, `lang="en"`.
- Responsive mobile-first; nessuno scroll orizzontale della pagina.
- Dopo ogni modifica eseguire `npm run build` e correggere eventuali errori prima di considerare il lavoro finito.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Images](https://docs.astro.build/en/guides/images/)