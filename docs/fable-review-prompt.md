# Prompt do wklejenia w nowej sesji z Fable

Skopiuj wszystko poniżej i wklej jako pierwszą wiadomość w sesji z modelem
Fable. Fable nie ma pamięci tej rozmowy — ten prompt musi dać mu pełny
kontekst sam z siebie.

---

Robię niezależny audyt prototypu AT1 (concierge test) w tym repo, zbudowanego
przez inną sesję Claude Code. Chcę Twojej świeżej, sceptycznej oceny — nie
mów mi, że jest dobrze, jeśli widzisz problemy.

## Kontekst

To prototyp na potrzeby testu hipotezy: czy sprzedawca w markecie FashionHero
zareaguje motywacyjnie, gdy zobaczy swoją realną marżę netto na tle mediany
kategorii (zamiast tylko przychodu). Typ testu: Wizard of Oz — dane
"personalizowane" są ręcznie wpisywane w URL params przez człowieka, nie ma
żadnego backendu ani prawdziwej automatyzacji.

Przeczytaj najpierw te pliki, w tej kolejności:
1. `docs/at1-feature-spec.md` — Project Config: stack, reguły, granice (co
   wolno, czego nie wolno budować)
2. `docs/at1-feature-spec-claude-code.md` — Feature Spec: opportunity,
   outcome, kryteria akceptacji
3. `docs/claude-code-prompt.md` — oryginalny task + adnotacje
   "[ZAKTUALIZOWANE]" pokazujące co zmieniło się względem pierwszej wersji
4. `docs/at1-success-signal.md` — wybór typu prototypu (Wizard of Oz) +
   zdefiniowane progi sukcesu/porażki PRZED testem

Potem przeczytaj implementację:
- `src/app/seller/analytics/page.tsx` — routing, parsowanie URL params
- `src/app/seller/analytics/_components/seller-analytics-experience.tsx` —
  cały interaktywny flow (stan zablokowany → loading → reveal → CTA)
- `src/app/seller/analytics/_components/analytics-header.tsx`
- `src/lib/seller-analytics.ts` — parsowanie params, formatowanie liczb
- `src/types/seller-analytics.ts` — model danych
- `src/components/seller-analytics-promo-modal.tsx` — popup na resztę
  sklepu, kierujący sellerów na `/seller/analytics`
- `src/components/shell.tsx` — zwróć uwagę na `BARE_ROUTE_PREFIXES`, to
  świadomy wyjątek od reguły "nie zmieniaj globalnego layoutu" w specach

## Co masz ocenić

1. **Spójność spec ↔ kod.** Specy mają świeże adnotacje
   "[ZAKTUALIZOWANE]" po tym, jak zauważyliśmy rozjazd między dokumentacją
   a tym, co faktycznie zbudowano (dwa ekrany → jeden, usunięty email,
   usunięty zewnętrzny link CTA, dodane karty-teasery, dodany popup).
   Sprawdź, czy coś nadal się nie zgadza mimo aktualizacji.

2. **Czy `at1-success-signal.md` ma sens względem tego, co realnie zbudowano.**
   Progi sukcesu/porażki zostały zdefiniowane pod kątem manualnego zbierania
   sygnału (nie ma analityki/backendu) — czy da się je w ogóle zmierzyć tym,
   co jest na stronie? Czy czegoś brakuje w "co liczysz"?

3. **Bugi i edge case'y w kodzie**, szczególnie:
   - `parseSellerParams` w `src/lib/seller-analytics.ts` — co się dzieje przy
     brakujących/nieprawidłowych wartościach liczbowych w URL?
   - Stan `loading` w `seller-analytics-experience.tsx` — `window.setTimeout`
     bez cleanup przy odmontowaniu komponentu, czy to problem w praktyce?
   - Czy dane demo (Kasia) i dane z realnego URL mogą się kiedykolwiek pomylić
     (np. seller widzi cudze dane)?

4. **UX krytyka** — czy flow (zablokowany → loading → reveal → pole reakcji
   → CTA) rzeczywiście prowadzi użytkownika naturalnie, czy są momenty
   tarcia, mylące copy, albo miejsca gdzie realny sprzedawca by się zgubił.

5. **Czy prototyp faktycznie testuje to, co deklaruje.** OUTCOME to
   ">60% sellerów reaguje motywacyjnie; <20% spontanicznie wspomina
   prowizję" — czy design ekranu w ogóle daje szansę zaobserwować tę różnicę,
   czy coś w UI/copy może sztucznie zawyżać/zaniżać wynik (np. sugestywne
   sformułowania, brak neutralności).

## Format odpowiedzi

Lista znalezisk, każde z: (a) co jest nie tak / ryzykowne, (b) dlaczego to
ma znaczenie dla tego konkretnego testu (nie ogólnie "best practice"), (c)
jak poważne — czy to blokuje wysłanie testu do prawdziwych sellerów, czy to
kosmetyka. Na końcu: jedno zdanie werdyktu — wysyłać ten prototyp do
prawdziwych sellerów w obecnym stanie, czy nie, i dlaczego.
