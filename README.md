# Útraty

Osobní evidence útrat pro iPhone. Webová appka (PWA), která se přidá na plochu a funguje i offline. Útraty se počítají po výplatních obdobích (výchozí je od 10. do 9. dalšího měsíce, dá se změnit v Nastavení).

## Jak to funguje

- **Přidat:** naťukej částku a ťukni na štítek kategorie. Útrata se hned uloží a jde vrátit. Kategorii lze i vyhledat nebo založit novou přímo z pole „Hledat nebo nová…“.
- **Přehled:** celková útrata za období, součty podle kategorií a seznam den po dni. Šipkami se přepíná na starší období.
- **Nastavení:** den výplaty, kategorie (přejmenovat, vyřadit, přidat) a záloha do souboru.

Data jsou jen v telefonu (`localStorage`), nikam se neposílají. Každý telefon má svoje vlastní data.

## Vývoj

```bash
npm test               # unit testy (node:test, bez závislostí)
npm run test:coverage  # testy s pokrytím
npm run serve          # appka na http://localhost:8080
```

Kód appky je ve složce `app/`: čisté HTML, CSS a JS moduly bez build kroku. Na GitHub Pages se publikuje jen tahle složka (`.github/workflows/pages.yml`).

Při přidání nového souboru do `app/` ho zapiš i do seznamu `SHELL` v `app/sw.js`, jinak nebude dostupný offline. Hlídá to test `tests/sw-shell.test.js`.

Service worker servíruje celou appku z jedné uložené verze. Workflow při nasazení vepíše do názvu cache hash commitu, takže se nová verze nainstaluje sama a na iPhonu se projeví při dalším spuštění. Při lokálním vývoji proto service worker vrací starší soubory: v DevTools zapni Application → Service workers → Update on reload.

Ikona se renderuje z `design/icon.html` (1024 × 1024) a zmenšuje na velikosti v `app/icons/`.

## Instalace na iPhone

Otevři adresu appky v Safari → Sdílet → Přidat na plochu.
