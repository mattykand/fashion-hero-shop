# Feature: Analizuj dane — AT1 concierge test

OPPORTUNITY: "Nie wiem ile naprawdę zarabiam na zamówieniu — widzę przychód, ale marżę netto poznaję dopiero gdy jest za późno" (O1, Bartek)
OUTCOME: >60% sellerów w Wariancie B reaguje motywacyjnie; <20% spontanicznie wspomina prowizję

Priorytet: Ekran 2 (/preview) jest core. Ekran 1 (fake door) nice-to-have w tej samej sesji.

## Co budujemy

Ekran 1 (/seller/analytics): landing z przykładowymi kartami i formularzem "Powiadom mnie". Ekran 2 (/seller/analytics/preview): dane sellera z URL params, dwa warianty A i B.

## Kryteria akceptacji

- Ekran 1: badge "WKRÓTCE", 3 blurred karty demo, formularz email (UI only)
- Ekran 2: czyta `?v=A|B&name=X&margin=X&cat_median=X&return_rate=X&cat_return=X&gmv=X&orders=X`
- Wariant A: marża netto + GMV + zamówienia, bez benchmarku
- Wariant B: marża + delta vs mediana + karta kosztu (return rate vs kategoria) + CTA
- Badge "DANE PRZYKŁADOWE" gdy brak params, ukryty gdy params obecne
- Mobile-first, 390px

## Czego NIE budujemy

- Backend, API routes, baza danych
- Autentykacja ani logowanie
- Automatyczne pobieranie danych sellera
- Filtry, wykresy historyczne, kalkulator "co gdyby"

## Przykłady

Input: `/seller/analytics/preview?v=B&name=Kasia&margin=412&cat_median=638&return_rate=21.2&cat_return=18.4&gmv=5374&orders=27`
Rezultat: nagłówek "Cześć, Kasia" + "Marża netto: 412 PLN / −35% vs mediana 638 PLN" + "Zwroty: 21,2% vs 18,4% w kategorii" + CTA

Input: `/seller/analytics/preview` (bez params)
Rezultat: te same karty z danymi hardcoded + badge "DANE PRZYKŁADOWE"
