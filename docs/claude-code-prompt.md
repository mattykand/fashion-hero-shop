# Zadanie dla Claude Code

Zaimplementuj prototyp analityki sprzedawcy (AT1 concierge test) wg:
- `docs/at1-feature-spec.md` — Project Config (stack, reguły, granice)
- `docs/at1-feature-spec-claude-code.md` — Feature Spec (co budujemy, kryteria)

## Kontekst projektu

- Stack: Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui
- Wzorzec: przeczytaj `src/app/prototype/page.tsx` przed pisaniem kodu
- Brak seller panelu z sidebar — buduj standalone strony jak /prototype
- `src/data/sellers.ts` nie ma danych finansowych — dane finansowe WYŁĄCZNIE z URL params

## `/seller/analytics` [ZAKTUALIZOWANE — jeden ekran, dwa stany, nie dwa URL-e]

Standalone strona, brak logowania (zakładamy, że seller jest już
zalogowany w realnym scenariuszu — stąd brak formularza email). Bez
chrome'u sklepu (announcement bar / nav / footer / koszyk) — wyjątek
w `Shell`, patrz `at1-feature-spec.md`.

Czyta dane z URL params. Dwa tryby, JEDEN URL:

**Demo** (brak params): stan zablokowany — minimalny header
("FashionHero · Panel sprzedawcy / Analizuj dane"), badge "WKRÓTCE",
headline "Twoja marża vs. mediana kategorii. W jednym widoku.",
zablurowane karty z hardcoded danymi Kasi (marża, zwroty, ranking,
per-produkt), jeden przycisk "Pokaż moją marżę". Po kliknięciu: stan
ładowania (~0.9s, spinner) → reveal z animacją odblurowania i badge
"DANE PRZYKŁADOWE".

**Concierge** (params obecne): reveal od razu przy wejściu, bez stanu
zablokowanego, bez badge "DANE PRZYKŁADOWE".

Params: `?name=X&shop=X&margin=X&cat_median=X&return_rate=X&cat_return=X&gmv=X&orders=X`

Po odsłonięciu: marża + delta vs mediana (czerwony gdy poniżej) + karta
kosztu (return rate vs kategoria) + karta "Ranking w kategorii" (zawsze
zablurowana, nie mamy tych danych) + karta "Marża i zwroty per produkt"
(zawsze zablurowana, teaser). Przed CTA: opcjonalne pole tekstowe "Co Cię
najbardziej zaskoczyło w tych liczbach?" — treść idzie razem z CTA, nie
osobnym submitem. CTA "Chcę indywidualną analizę marży" jest **in-page**
(potwierdzenie lokalne) — NIE linkuje do `forms.gle` ani żadnego
zewnętrznego formularza; to był martwy link i psuł doświadczenie.

Dodatkowo: popup promocyjny (`SellerAnalyticsPromoModal`) pokazuje się na
reszcie sklepu (poza tą stroną) i linkuje tutaj — służy do kierowania
wybranych sellerów na test.

Format liczb: `toLocaleString('pl-PL')` → "1 248 PLN"

## Po implementacji

```bash
npm run build        # zero błędów TypeScript
git add -A
git commit -m "feat: AT1 concierge test — seller analytics prototype"
git push
```

## Nie rób

- Nie modyfikuj istniejących stron ani komponentów [WYJĄTEK: `Shell`
  zmodyfikowany na wyraźną prośbę, żeby `/seller/analytics` faktycznie
  było standalone — zobacz `at1-feature-spec.md`, sekcja ASK FIRST]
- Nie buduj backendu, API routes ani bazy danych
- Nie dodawaj nowych bibliotek npm
- Nie twórz seller panelu z sidebar — standalone pages only
