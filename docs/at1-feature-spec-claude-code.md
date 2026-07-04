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
