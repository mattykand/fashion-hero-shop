# Zadanie dla Claude Code

Zaimplementuj prototyp analityki sprzedawcy (AT1 concierge test) wg:
- `docs/at1-feature-spec.md` — Project Config (stack, reguły, granice)
- `docs/at1-feature-spec-claude-code.md` — Feature Spec (co budujemy, kryteria)

## Kontekst projektu

- Stack: Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui
- Wzorzec: przeczytaj `src/app/prototype/page.tsx` przed pisaniem kodu
- Brak seller panelu z sidebar — buduj standalone strony jak /prototype
- `src/data/sellers.ts` nie ma danych finansowych — dane finansowe WYŁĄCZNIE z URL params

## Ekran 1 — `/seller/analytics`

Standalone strona, brak logowania. Zawiera:
- Minimalny header: "FashionHero · Panel sprzedawcy / Analizuj dane"
- Headline: "Twoja marża vs. mediana kategorii. W jednym widoku."
- Badge "WKRÓTCE"
- 3 preview karty z danymi demo, zablurowane (marża netto, return rate, ranking)
- Formularz email "Powiadom mnie, gdy ruszy" — tylko UI, bez logiki
- Nota: "To wczesny podgląd. Twój zapis wpływa na decyzję o budowie."

## Ekran 2 — `/seller/analytics/preview`

Czyta dane z URL params. Dwa tryby:

**Demo** (brak params): hardcoded dane Kasi + badge "DANE PRZYKŁADOWE"
**Concierge** (params obecne): dane z URL, brak badge

Params: `?name=X&shop=X&margin=X&cat_median=X&return_rate=X&cat_return=X&gmv=X&orders=X`

Jeden ekran wyniku (brak wariantu A): marża + delta vs mediana (czerwony gdy poniżej) + karta kosztu (return rate vs kategoria) + CTA button → `https://forms.gle/placeholder`

Format liczb: `toLocaleString('pl-PL')` → "1 248 PLN"

## Po implementacji

```bash
npm run build        # zero błędów TypeScript
git add -A
git commit -m "feat: AT1 concierge test — seller analytics prototype"
git push
```

## Nie rób

- Nie modyfikuj istniejących stron ani komponentów
- Nie buduj backendu, API routes ani bazy danych
- Nie dodawaj nowych bibliotek npm
- Nie twórz seller panelu z sidebar — standalone pages only
