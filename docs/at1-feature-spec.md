PROJECT: FashionHero — Seller Analytics (AT1 Concierge Test)
ROLE: Budujesz prototyp analityki dla sprzedawców FashionHero — dwa ekrany
testujące założenie AT1: czy seller zareaguje konstruktywnie widząc realną marżę.

Cel aplikacji:
Fake door + concierge test. Ekran 1: landing "Analizuj dane" z CTA zapisu na
listę oczekujących. Ekran 2: spersonalizowany panel analityczny z danymi
konkretnego sellera. Dane w Ekranie 2 są wstrzykiwane przez URL params — brak
backendu. Celem jest zebranie reakcji emocjonalnych, nie budowa produktu.

Wytyczne designu:
- Wzorzec: /app/prototype/page.tsx — osobna standalone strona, nie seller panel
- Jasne, czyste tło (bg-gray-50), białe karty z border-gray-100, zaokrąglone rogi
- Używaj Tailwind + shadcn/ui jak w istniejącym codebase
- Mobile-first. Oba ekrany muszą działać na telefonie
- Ekran 2 działa w dwóch trybach: demo (dane przykładowe) i concierge (dane z URL)

Styl kodu:
- TypeScript strictly, zero typów any
- Dane sellera ZAWSZE z URL params lub stałej testowej — nigdy hardcode w środku
  komponentu
  Good: const data = parseSellerParams(searchParams)
  Bad: const margin = 412
- Nie modyfikuj istniejących stron, routingu ani layoutu globalnego
- Nowe strony w /app/seller/analytics/ (utwórz folder, nie istnieje)

Reguły domenowe:
- Waluta: PLN, format "1 248 PLN" (spacja jako separator tysięcy)
- Jeden ekran wyniku: marża + benchmark kategorii + jeden wskazany koszt (return_rate).
  Brak wariantu A — pełny framing dla każdego sellera.
- Każdy seller ma unikalny URL z parametrami: ?seller=id&margin=412&
  cat_median=638&return_rate=21.2&cat_return=18.4
- Badge "DANE PRZYKŁADOWE" w demo mode, ukryty gdy URL zawiera seller param

Model danych:
SellerData { name, shop_name, category, gmv, orders, net_margin,
  return_rate, cat_median_margin, cat_median_return }

ALWAYS:
- Wzoruj się na /app/prototype/page.tsx — standalone strona z własnym headerem
- Używaj istniejących komponentów UI z shadcn/ui i Tailwind klas z reszty projektu
- TypeScript strict, wszystkie typy zdefiniowane

ASK FIRST:
- Przed zmianą istniejącej nawigacji lub globalnego layoutu
- Przed dodaniem nowej zależności npm

NEVER:
- Nie buduj backendu, bazy danych, auth ani API routes
- Nie pokazuj danych jednego sellera innemu (każdy URL jest unikalny i tymczasowy)
- Nie usuwaj istniejących stron ani komponentów
