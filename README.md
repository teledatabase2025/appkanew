# Escape Codex — mobilní PWA pro únikové hry

Prototyp instalovatelné mobilní webové aplikace pro únikové hry. Obsahuje hráčské rozhraní, aktivaci kódem, ukládání průchodu hrou, nápovědy, body, žebříčky a administrační rozhraní pro tvorbu a testování her.

## Spuštění

```bash
npm start
```

Poté otevři:

```text
http://127.0.0.1:5173
```

## Instalace do mobilu

Aplikace je připravena jako PWA (`manifest.webmanifest` + `sw.js`). Po nasazení na HTTPS ji lze v mobilním prohlížeči přidat na plochu a spouštět jako instalovatelnou aplikaci. Pro publikaci do App Store / Google Play je možné stejný frontend zabalit např. pomocí Capacitoru.

## Demo účty

- Hráč: `hrac@demo.cz` / `demo123`
- Admin: `admin@escape.local` / `admin123`

## Demo aktivační kódy

- Kodex Ztraceného světa: `KODX-2026-PRAH`
- Labyrint Starého Města je připravený jako koncept a admin ho musí nejdřív spustit online.

## Nejlepší formát pro dodání obsahu her

Nejlépe pošli každou hru jako tabulku nebo JSON/YAML, kde jeden řádek/objekt odpovídá jednomu slidu:

```yaml
game:
  title: "Kodex Ztraceného světa"
  activation_codes: ["KODX-2026-PRAH"]
  design:
    font: "Cinzel"
    color: "#86d6ff"
slides:
  - number: 1
    admin_title: "Prolog"
    type: 2
    content_blocks:
      - type: text
        value: "Text pro hráče, může obsahovat **tučné** a *kurzívu*."
      - type: image
        file: "prolog.jpg"
      - type: audio
        file: "ambient.mp3"
    button_text: "Pokračovat"
    hints: []
    points: 0
    hint_penalty: 0
    wrong_penalty: 0
    correct_answers: []
    options: []
    inventory_add: []
    branching: []
```

U obrázků a zvuků stačí připojit soubory zvlášť a ve slidu uvést jejich názvy. Pokud bude jednodušší tabulka, použij sloupce: `číslo`, `název pro admina`, `typ`, `texty`, `obrázky`, `audio`, `odpovědi`, `možnosti`, `nápovědy`, `body`, `srážka nápověda`, `srážka chyba`, `inventář`, `větvení/cíl`.

## Kontrola syntaxe

```bash
npm run build
```
