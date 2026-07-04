# Prompt do wklejenia w nowej sesji z Fable

Skopiuj wszystko poniżej i wklej jako pierwszą wiadomość w sesji z modelem
Fable. Fable nie ma pamięci tej rozmowy — ten prompt musi dać mu pełny
kontekst sam z siebie.

---

Robię niezależny audyt prototypu AT1 (concierge test) w tym repo, zbudowanego
przez inną sesję Claude Code. Chcę Twojej świeżej, sceptycznej oceny — nie
mów mi, że jest dobrze, jeśli widzisz problemy.

## Kontekst biznesowy (z Opportunity Solution Tree projektu)

**Cel biznesowy (outcome):** zwiększyć przychód FashionHero per zamówienie
z ~27 PLN do ~29 PLN do 31.12.2026 przez nowe źródła przychodu.

**Opportunity O1** (dla której budujemy to rozwiązanie): "Seller nie wie ile
rzeczywiście zarabia (ukryte koszty zwrotów)". Najwyżej oceniona okazja w
drzewie (pain 4/5, reach 4/5, evidence 4/5, strategic 5/5). Dowody: wywiad z
sellerem — 40%+ zwrotów, ślepy punkt; 22 na 500 przebadanych sellerów ma już
ujemną marżę; dane firmowe: 6.7M PLN kosztów zwrotów vs 8.2M PLN przychodu z
prowizji miesięcznie.

**Wybrane rozwiązanie:** "True Margin Statement" — pokazać sellerowi jego
realną marżę netto. Ten prototyp (`/seller/analytics`) to test tego
rozwiązania.

**Najbardziej ryzykowne założenie (to testuje AT1):** Seller, widząc swoją
realną (niższą niż zakładał) marżę, zareaguje konstruktywną akcją (np.
ograniczy zwroty), a NIE wycofaniem się lub obwinianiem prowizji platformy.

**Dlaczego to jest realne ryzyko, nie teoretyczne** — kluczowe dla oceny
UX i copy: stawka prowizji (`commission_rate`) ma korelację r=+0.71 z marżą
sellera — to dominujący czynnik w danych. Seller robiący własną matematykę
MOŻE dojść do wniosku "problemem jest prowizja platformy", nie "problemem
są moje zwroty" — i zacząć domagać się niższej prowizji. To odwróciłoby
zamierzony efekt biznesowy (przychód per zamówienie ma ROSNĄĆ, nie spadać).
Design ekranu musi kierować uwagę na return rate jako dźwignię, którą seller
kontroluje — nie dawać pretekstu do winienia platformy.

**Oryginalny projekt testu porównywał dwa warianty framingu**, nie jeden:
(A) goła liczba marży, (B) liczba + porównanie do kategorii + wskazany
lewar (return rate jako główny koszt). Cel porównania: sprawdzić, czy sam
fakt pokazania marży wystarczy, czy dopiero kontekst/benchmark skłania do
konstruktywnej reakcji zamiast obwiniania prowizji. **W trakcie budowy
Wariant A został świadomie usunięty** (uproszczenie zakresu — zobacz
adnotacje w `docs/at1-feature-spec-claude-code.md`), więc obecny prototyp
testuje TYLKO wariant B. Oceń, czy to osłabia wartość testu — bez wariantu A
nie da się już sprawdzić, czy sam kontekst/benchmark faktycznie robi różnicę,
tylko czy wariant B sam w sobie działa.

**Pełne kryteria z oryginalnego OST (szersze niż w `at1-success-signal.md`):**
- sukces: >60% reakcji motywacyjnych nie defensywnych; <20% spontanicznych
  żądań niższej prowizji; **widoczny spadek return rate vs. grupa kontrolna
  w 30-60 dni** (efekt długoterminowy, którego sam prototyp UI nie zmierzy —
  wymaga osobnego trackingu poza tym repo)
- porażka: przewaga reakcji zniechęcenia/wycofania; powtarzające się żądania
  niższej prowizji; brak różnicy w return rate vs. kontrola

Sprawdź, czy `docs/at1-success-signal.md` w ogóle uwzględnia pomiar return
rate po 30-60 dniach (prawdopodobnie nie — prototyp mierzy tylko
natychmiastową reakcję) i czy to luka, którą warto nazwać wprost.

## Kontekst techniczny

To prototyp Wizard of Oz — dane "personalizowane" są ręcznie wpisywane w URL
params przez człowieka, nie ma żadnego backendu ani prawdziwej automatyzacji.

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

6. **Czy copy przypadkiem nie podsuwa winy na prowizję.** To jest
   NAJWAŻNIEJSZE ryzyko biznesowe tego testu (zobacz sekcję o korelacji
   r=+0.71 wyżej). Przeczytaj dosłownie każdy tekst na ekranie
   (`seller-analytics-experience.tsx`) i oceń: czy cokolwiek — słowo,
   kolejność informacji, sposób pokazania delty vs mediana — mogłoby
   naprowadzić sellera na "to platforma mi zabiera" zamiast "to moje
   zwroty mnie kosztują". Zwróć szczególną uwagę na kartę return rate —
   czy jest wystarczająco wyeksponowana jako GŁÓWNY wskazany lewar, czy
   ginie obok reszty.

## Format odpowiedzi

Lista znalezisk, każde z: (a) co jest nie tak / ryzykowne, (b) dlaczego to
ma znaczenie dla tego konkretnego testu (nie ogólnie "best practice"), (c)
jak poważne — czy to blokuje wysłanie testu do prawdziwych sellerów, czy to
kosmetyka. Na końcu: jedno zdanie werdyktu — wysyłać ten prototyp do
prawdziwych sellerów w obecnym stanie, czy nie, i dlaczego.
