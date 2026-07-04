# Feature: Analizuj dane — AT1 concierge test

OPPORTUNITY: "Nie wiem ile naprawde zarabiam na zamowieniu — widze przychod, ale marze netto poznaje dopiero gdy jest za pozno" (O1, Bartek)
OUTCOME: >60% sellerow reaguje motywacyjnie; <20% spontanicznie wspomina prowizje

Priorytet: reveal (odsłonięcie realnych danych sellera) jest core. Stan
zablokowany (fake door) nice-to-have w tej samej sesji.

## Co budujemy [ZAKTUALIZOWANE — jeden ekran, nie dwa]

Jedna strona `/seller/analytics`, dwa stany zamiast dwóch URL-i:

- **Zablokowany** (brak URL params = demo): badge "WKRÓTCE", zablurowane karty
  (marża, zwroty, ranking, per-produkt — dane demo Kasi), jeden przycisk
  "Pokaż moją marżę" (bez formularza email — zakładamy, że seller jest
  zalogowany, więc nie trzeba go pytać o kontakt).
- **Odsłonięty**: po kliknięciu — krótki stan ładowania (~0.9s, spinner
  "Analizujemy Twoją marżę..."), potem karty się odblurowywują z animacją.
  Spersonalizowany link (URL params obecne) pomija stan zablokowany i
  odsłania dane od razu przy wejściu na stronę.

## Kryteria akceptacji [ZAKTUALIZOWANE]

- Zablokowany stan: badge "WKRÓTCE", zablurowane karty demo, jeden przycisk
  reveal (bez formularza email)
- Strona czyta `?name=X&shop=X&margin=X&cat_median=X&return_rate=X&cat_return=X&gmv=X&orders=X`
  (brak parametru `v` — nie ma już Wariantu A)
- Po odsłonięciu: marża netto + delta vs mediana kategorii (czerwony gdy
  poniżej) + karta kosztu (return rate vs kategoria) + karta "Ranking w
  kategorii" (zawsze zablurowana — nie mamy realnych danych rankingu) +
  karta "Marża i zwroty per produkt" (zawsze zablurowana — teaser
  przyszłego rozbicia per SKU)
- Przed CTA: opcjonalne pole tekstowe "Co Cię najbardziej zaskoczyło w tych
  liczbach?" — treść idzie razem z kliknięciem CTA, nie osobnym submitem
- CTA "Chcę indywidualną analizę marży" jest **in-page** (potwierdzenie
  lokalne), NIE linkuje na zewnątrz — wcześniejszy link do forms.gle był
  martwym linkiem i psuł doświadczenie
- Badge "DANE PRZYKŁADOWE" gdy brak params, ukryty gdy params obecne
- Strona `/seller/analytics` nie ma chrome'u sklepu (announcement bar, nav,
  footer, ikona koszyka) — to prawdziwie standalone strona, wymusza to
  wyjątek w `Shell` (patrz `at1-feature-spec.md`, sekcja ASK FIRST)
- Osobny popup promocyjny (`SellerAnalyticsPromoModal`) pokazuje się na
  reszcie sklepu (poza `/seller/analytics`) i linkuje do tej strony —
  używany do kierowania wybranych sellerów na test
- Mobile-first, 390px

## Czego NIE budujemy

- Backend, API routes, baza danych
- Autentykacja ani logowanie
- Automatyczne pobieranie danych sellera
- Filtry, wykresy historyczne, kalkulator "co gdyby"
- Wariant A — tylko jeden ekran z pelnym framingiem (B)
- Osobny URL `/preview` — wszystko dzieje się na `/seller/analytics`

## Przykłady

Input: `/seller/analytics?name=Kasia&margin=412&cat_median=638&return_rate=21.2&cat_return=18.4&gmv=5374&orders=27`
Rezultat: od razu odsłonięte — naglowek "Cześć, Kasia" + "Marża netto: 412 PLN / -35% vs mediana 638 PLN" + "Zwroty: 21,2% vs 18,4% w kategorii" + pole reakcji + CTA (bez badge "DANE PRZYKŁADOWE")

Input: `/seller/analytics` (bez params)
Rezultat: stan zablokowany, zablurowane karty z danymi Kasi, przycisk "Pokaż moją marżę" → po kliknięciu loading → reveal z badge "DANE PRZYKŁADOWE"

---

# Załącznik A: Zadanie dla Claude Code (oryginalny prompt implementacyjny)

Zaimplementuj prototyp analityki sprzedawcy (AT1 concierge test) wg:
- `docs/at1-feature-spec.md` — Project Config (stack, reguły, granice)
- ten plik (sekcje wyżej) — Feature Spec (co budujemy, kryteria)

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
kosztu (return rate vs kategoria, z deltą w pp i wskazaniem zwrotów jako
lewara) + karta "Ranking w kategorii" (zawsze zablurowana, nie mamy tych
danych) + karta "Marża i zwroty per produkt" (zawsze zablurowana, teaser).
Przed CTA: opcjonalne pole tekstowe "Co Cię najbardziej zaskoczyło w tych
liczbach?" — treść idzie razem z CTA, nie osobnym submitem. CTA "Chcę
indywidualną analizę marży" jest **in-page** (potwierdzenie lokalne) —
NIE linkuje do `forms.gle` ani żadnego zewnętrznego formularza.

Dodatkowo: popup promocyjny (`SellerAnalyticsPromoModal`) pokazuje się na
reszcie sklepu (poza tą stroną) i linkuje tutaj — służy do kierowania
wybranych sellerów na test.

Tracking: PostHog EU (`src/instrumentation-client.ts`), eventy
`promo_popup_shown/accepted/dismissed`, `margin_revealed`,
`analysis_requested`, `reaction_submitted` — szczegóły w
`docs/at1-success-signal.md`.

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
- Nie dodawaj nowych bibliotek npm [WYJĄTEK: `posthog-js` dodany na
  wyraźną prośbę — podstawowy tracking do zbierania sygnałów testu]
- Nie twórz seller panelu z sidebar — standalone pages only

---

# Załącznik B: Prompt do niezależnego audytu (Fable / świeża sesja)

Skopiuj wszystko poniżej i wklej jako pierwszą wiadomość w nowej sesji
(np. z modelem Fable). Nowa sesja nie ma pamięci — prompt musi dać jej
pełny kontekst sam z siebie.

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
adnotacje wyżej w tym pliku), więc obecny prototyp testuje TYLKO wariant B.
Oceń, czy to osłabia wartość testu — bez wariantu A nie da się już
sprawdzić, czy sam kontekst/benchmark faktycznie robi różnicę, tylko czy
wariant B sam w sobie działa.

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
   outcome, kryteria akceptacji + Załącznik A (oryginalny task z adnotacjami
   "[ZAKTUALIZOWANE]" pokazującymi, co zmieniło się względem pierwszej wersji)
3. `docs/at1-success-signal.md` — wybór typu prototypu (Wizard of Oz) +
   zdefiniowane progi sukcesu/porażki PRZED testem + stress test Forte

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
- `src/instrumentation-client.ts` — PostHog tracking

## Co masz ocenić

1. **Spójność spec ↔ kod.** Specy mają adnotacje "[ZAKTUALIZOWANE]" po tym,
   jak zauważyliśmy rozjazd między dokumentacją a tym, co faktycznie
   zbudowano (dwa ekrany → jeden, usunięty email, usunięty zewnętrzny link
   CTA, dodane karty-teasery, dodany popup). Sprawdź, czy coś nadal się nie
   zgadza mimo aktualizacji.

2. **Czy `at1-success-signal.md` ma sens względem tego, co realnie zbudowano.**
   Czy progi da się zmierzyć tym, co jest na stronie i w PostHog? Czy czegoś
   brakuje w "co liczysz"?

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

5. **Czy prototyp faktycznie testuje to, co deklaruje.** Czy design ekranu
   w ogóle daje szansę zaobserwować różnicę między reakcją motywacyjną a
   defensywną, czy coś w UI/copy może sztucznie zawyżać/zaniżać wynik.

6. **Czy copy przypadkiem nie podsuwa winy na prowizję.** To jest
   NAJWAŻNIEJSZE ryzyko biznesowe tego testu (zobacz sekcję o korelacji
   r=+0.71 wyżej). Przeczytaj dosłownie każdy tekst na ekranie
   (`seller-analytics-experience.tsx`) i oceń: czy cokolwiek — słowo,
   kolejność informacji, sposób pokazania delty vs mediana — mogłoby
   naprowadzić sellera na "to platforma mi zabiera" zamiast "to moje
   zwroty mnie kosztują".

## Format odpowiedzi

Lista znalezisk, każde z: (a) co jest nie tak / ryzykowne, (b) dlaczego to
ma znaczenie dla tego konkretnego testu (nie ogólnie "best practice"), (c)
jak poważne — czy to blokuje wysłanie testu do prawdziwych sellerów, czy to
kosmetyka. Na końcu: jedno zdanie werdyktu — wysyłać ten prototyp do
prawdziwych sellerów w obecnym stanie, czy nie, i dlaczego.
