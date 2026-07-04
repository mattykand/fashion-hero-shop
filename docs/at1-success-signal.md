# AT1 — Sygnał sukcesu (zdefiniowany PRZED testem)

Bazuje na OUTCOME z `at1-feature-spec-claude-code.md`:
> ">60% sellerów reaguje motywacyjnie; <20% spontanicznie wspomina prowizję"

Ponieważ w prototypie nie ma backendu ani analityki (żadnych kliknięć nie
zapisujemy automatycznie), sygnał zbierasz ręcznie podczas/po rozmowie
concierge z każdym sellerem, któremu wysyłasz spersonalizowany link.

## Co liczysz

Dla każdego sellera, który dostał link, zapisz w jednym miejscu (arkusz,
notatka — cokolwiek, byle jedno):

- [ ] **Reakcja po zobaczeniu marży** — motywacyjna (np. "muszę to sprawdzić",
      "co mogę z tym zrobić") / obojętna / defensywna (wina prowizji, platformy)
- [ ] **Kliknięcie CTA** "Chcę indywidualną analizę marży" — tak/nie
- [ ] **Odpowiedź w polu "co Cię zaskoczyło"** — treść (jeśli wypełnione, to
      surowy cytat reakcji, nie trzeba go interpretować z pamięci)
- [ ] **Spontaniczne wspomnienie prowizji** jako przyczyny niskiej marży — tak/nie
- [ ] **Otwarcie linku w ogóle** — tak/nie (jeśli wysyłasz ręcznie, wiesz o tym z rozmowy)

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
