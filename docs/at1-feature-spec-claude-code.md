# Feature: Analizuj dane — AT1 concierge test

OPPORTUNITY: "Nie wiem ile naprawde zarabiam na zamowieniu — widze przychod, ale marze netto poznaje dopiero gdy jest za pozno" (O1, Bartek)
OUTCOME: >60% sellerow reaguje motywacyjnie; <20% spontanicznie wspomina prowizje

Priorytet: Ekran 2 (/preview) jest core. Ekran 1 (fake door) nice-to-have w tej samej sesji.

## Co budujemy

Ekran 1 (/seller/analytics): landing z przykladowymi kartami i formularzem "Powiadom mnie". Ekran 2 (/seller/analytics/preview): dane sellera z URL params — marza + benchmark kategorii + wskazany koszt.

## Kryteria akceptacji

- Ekran 1: badge "WKROTCE", 3 blurred karty demo, formularz email (UI only)
- Ekran 2: czyta `?name=X&margin=X&cat_median=X&return_rate=X&cat_return=X&gmv=X&orders=X`
- Ekran 2 pokazuje: marza netto + delta vs mediana kategorii + karta kosztu (return rate vs kategoria) + CTA zewnetrzny
- Badge "DANE PRZYKLADOWE" gdy brak params, ukryty gdy params obecne
- Mobile-first, 390px

## Czego NIE budujemy

- Backend, API routes, baza danych
- Autentykacja ani logowanie
- Automatyczne pobieranie danych sellera
- Filtry, wykresy historyczne, kalkulator "co gdyby"
- Wariant A — tylko jeden ekran z pelnym framingiem (B)

## Przykłady

Input: `/seller/analytics/preview?name=Kasia&margin=412&cat_median=638&return_rate=21.2&cat_return=18.4&gmv=5374&orders=27`
Rezultat: naglowek "Czesc, Kasia" + "Marza netto: 412 PLN / -35% vs mediana 638 PLN" + "Zwroty: 21,2% vs 18,4% w kategorii" + CTA

Input: `/seller/analytics/preview` (bez params)
Rezultat: te same karty z danymi hardcoded + badge "DANE PRZYKLADOWE"
