# AT1 — Definicja testu

## Krok 1: Typ prototypu

**Wybór: Wizard of Oz.**

Uzasadnienie (1 zdanie): testujemy value delivery — czy seller doceni realną
informację o swojej marży i benchmarku na tle kategorii — a dostarczamy ją
"udając" automatyzację (dane ręcznie wpisane w URL params, "indywidualna
analiza" po CTA to w praktyce ręczna obsługa concierge), więc to nie smoke
test (nie pytamy tylko "czy klikną") ani interaktywny mock (nie testujemy
"czy ogarną UI") — pytamy, czy wartość informacji realnie ich rusza.

## Krok 3: Sygnał sukcesu (zdefiniowany PRZED testem)

Bazuje na OUTCOME z `at1-feature-spec-claude-code.md`:
> ">60% sellerów reaguje motywacyjnie; <20% spontanicznie wspomina prowizję"

Sygnały ilościowe zbiera PostHog (EU Cloud, projekt "Default project"):
pageviews + autocapture kliknięć + trzy custom eventy z właściwością
`seller_name`, więc widzisz kto co zrobił bez pytania:

- `promo_popup_shown` / `promo_popup_accepted` / `promo_popup_dismissed`
  (method: later_button/close_button/backdrop/escape) — lejek popupu na sklepie
- `margin_revealed` (mode: demo/concierge) — seller otworzył link i zobaczył liczby
- `analysis_requested` (reaction_provided: tak/nie) — kliknął "Chcę indywidualną analizę marży"
- `reaction_submitted` (reaction_text) — surowy cytat z pola "co Cię zaskoczyło"

Reakcję emocjonalną (motywacyjna/defensywna) nadal oceniasz ręcznie z
rozmowy — tego żaden event nie złapie.

## Co liczysz

Dla każdego sellera, który dostał link, zapisz w jednym miejscu (arkusz,
notatka — cokolwiek, byle jedno):

- [ ] **Reakcja po zobaczeniu marży** — motywacyjna (np. "muszę to sprawdzić",
      "co mogę z tym zrobić") / obojętna / defensywna (wina prowizji, platformy)
      — ręcznie, z rozmowy
- [ ] **Kliknięcie CTA** "Chcę indywidualną analizę marży" — z PostHog
      (`analysis_requested`, filtruj po seller_name)
- [ ] **Odpowiedź w polu "co Cię zaskoczyło"** — z PostHog
      (`reaction_submitted.reaction_text` — surowy cytat)
- [ ] **Spontaniczne wspomnienie prowizji** jako przyczyny niskiej marży —
      tak/nie, ręcznie z rozmowy
- [ ] **Otwarcie linku w ogóle** — z PostHog (`margin_revealed` z mode=concierge)

## Próg sukcesu [ZAKTUALIZOWANE po stress teście Forte — zobacz sekcję niżej]

- **≥60%** sellerów (min. próba: 10) reaguje motywacyjnie
- ~~**<20%** sellerów spontanicznie obwinia prowizję/platformę~~ — USUNIĘTE:
  po wejściu Forte 0% wzmianki o prowizji są wywołane rynkiem, nie naszym
  framingiem; kryterium niemierzalne. Zastąpione:
- **≥40%** sellerów po zobaczeniu marży pyta o / deklaruje konkretną akcję
  redukcji zwrotów — mierzy konstruktywność wprost, odporne na szum Forte
- Przynajmniej część sellerów sama pyta "co mogę zrobić lepiej" bez podpowiedzi

## Próg porażki [ZAKTUALIZOWANE po stress teście Forte]

- **<3 na 10** przetestowanych reaguje motywacyjnie → koncept nie działa,
  nie buduj dalej analityki marży w tej formie
- ~~**>40%** spontanicznie wini prowizję/platformę~~ — USUNIĘTE (jak wyżej:
  skażone rynkiem po Forte). Zastąpione:
- **Większość reakcji to rozważanie migracji** ("to przejdę na Forte")
  zamiast akcji na zwroty → informacja o marży napędza odejścia, nie
  poprawę — nie buduj w tej formie
- Zero kliknięć CTA mimo motywacyjnych reakcji słownych → sygnał, że
  zainteresowanie jest deklaratywne, nie realne — nie buduj płatnego
  produktu na tej podstawie

## Zanim wyślesz pierwszy link

- [ ] Próba: ile sellerów planujesz przetestować? (wpisz liczbę: ___)
- [ ] Kto ocenia "motywacyjna vs defensywna" reakcję — Ty ręcznie, na
      podstawie rozmowy/wiadomości? Zapisz kryterium, żeby nie interpretować
      pod tezę po fakcie.
- [ ] Gdzie zapisujesz wyniki na bieżąco (nie "podsumuję na koniec z pamięci")

---

## Stress test: wejście Forte Fashion (0% prowizji)

### 3 pytania (odpowiedzi szczere, przed racjonalizacją)

**A. Czy koncept tworzy wartość, której Forte 0% nie skopiuje?**
Sam dashboard marży Forte skopiuje w kwartał — ale nie skopiuje benchmarków
kategorii, bo te wymagają gęstości danych (300k zamówień/mc, 500+ sellerów,
historia zwrotów), której nowy gracz z definicji nie ma. Po drugie, koncept
adresuje zwroty — a zwroty nie znikają przy 0% prowizji; na Forte seller
dalej będzie na nich tracił, tylko nikt mu tego nie pokaże. Rana: dla 22
sellerów z ujemną marżą przejście na 0% to szybsza poprawa marży niż walka
ze zwrotami (r=+0.71 prowizja↔marża).

**B. Czy primary metric jest odporna na drenaż sellerów?**
Częściowo: concierge test na ręcznie dobranej próbie, mierzony w rozmowie —
drenaż nie psuje go mechanicznie jak adoption/GMV. Ale bias kompozycji jest
realny (zostają więksi i lojalniejsi → wynik zawyżony vs populacja), a
kryterium "<20% spontanicznie wspomina prowizję" umarło — przy medialnym
wejściu Forte sellerzy mówią o prowizji z powodu rynku, nie framingu.

**C. Czy hipoteza dalej trzyma?**
Ukryte założenie w "bo" hipotezy: prowizja to stała rynku, więc jedyny
dostępny lewar to własne koszty. Forte to łamie — najtańszą "konstruktywną
akcją" na niską marżę jest teraz zmiana platformy. Hipoteza pęka w połowie:
wartość informacji trzyma (może rośnie), przewidywana akcja — już nie.

### Decyzja: ADJUST

Core broni się — benchmark kategorii to wartość, której Forte nie zbuduje
bez danych, a zwroty pozostają kosztem niezależnym od prowizji. Ale
kryterium "nie wspomina prowizji" i próba z nadreprezentacją ujemno-marżowych
straciły sens — test w starym kształcie zmierzyłby szum migracji, nie
założenie.

### Co się zmienia — W A/B test design

- **Metryka:** "<20% wspomina prowizję" USUNIĘTE (skażone rynkiem);
  zastąpione "% sellerów pytających o / deklarujących konkretną akcję
  redukcji zwrotów" (progi zaktualizowane wyżej w tym pliku)
- **Hipoteza:** doprecyzowana — "...bo zwroty to jedyny duży koszt, który
  seller kontroluje NIEZALEŻNIE od platformy" (po Forte to zdanie jest
  mocniejsze, nie słabsze)
- **Sample:** zamiast nadreprezentacji 22 ujemno-marżowych — sellerzy o
  niskim ryzyku odejścia (staż, GMV); grupa ujemno-marżowa to frontline
  drenażu, jej reakcja mierzy decyzję o migracji, nie reakcję na framing.
  Plus jedno pytanie kontrolne o Forte w rozmowie, żeby odseparować wzmianki
  o prowizji "z rynku" od wywołanych naszym ekranem.
