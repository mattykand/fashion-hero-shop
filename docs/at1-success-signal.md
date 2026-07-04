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

## Próg sukcesu

- **≥60%** sellerów (min. próba: 10) reaguje motywacyjnie
- **<20%** sellerów spontanicznie obwinia prowizję/platformę zamiast
  własnych kosztów (return rate, marża)
- Przynajmniej część sellerów sama pyta "co mogę zrobić lepiej" bez podpowiedzi

## Próg porażki

- **<3 na 10** przetestowanych reaguje motywacyjnie → koncept nie działa,
  nie buduj dalej analityki marży w tej formie
- **>40%** spontanicznie wini prowizję/platformę → framing "marża vs mediana"
  nie jest przyjmowany, seller czuje się atakowany zamiast poinformowany
- Zero kliknięć CTA mimo motywacyjnych reakcji słownych → sygnał, że
  zainteresowanie jest deklaratywne, nie realne — nie buduj płatnego
  produktu na tej podstawie

## Zanim wyślesz pierwszy link

- [ ] Próba: ile sellerów planujesz przetestować? (wpisz liczbę: ___)
- [ ] Kto ocenia "motywacyjna vs defensywna" reakcję — Ty ręcznie, na
      podstawie rozmowy/wiadomości? Zapisz kryterium, żeby nie interpretować
      pod tezę po fakcie.
- [ ] Gdzie zapisujesz wyniki na bieżąco (nie "podsumuję na koniec z pamięci")
