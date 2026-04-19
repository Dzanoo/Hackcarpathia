"use client";

import { useState } from "react";
import { Scale, Search, ArrowLeft } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

const PRACA_ARTICLES = [
  { name: "Art. 22 §1", desc: "Definicja stosunku pracy: pracownik zobowiązuje się do pracy pod kierownictwem pracodawcy, a pracodawca do zatrudniania za wynagrodzeniem." },
  { name: "Art. 29 §1", desc: "Umowa o pracę określa strony, rodzaj pracy, miejsce pracy, wynagrodzenie, wymiar czasu pracy i dzień rozpoczęcia pracy." },
  { name: "Art. 30 §1-4", desc: "Sposoby rozwiązania umowy o pracę: porozumienie, wypowiedzenie, rozwiązanie bez wypowiedzenia, upływ czasu. Wypowiedzenie wymaga formy pisemnej i wskazania przyczyny." },
  { name: "Art. 52 §1", desc: "Pracodawca może rozwiązać umowę bez wypowiedzenia z winy pracownika m.in. za ciężkie naruszenie obowiązków, popełnienie przestępstwa lub utratę uprawnień." },
  { name: "Art. 53 §1", desc: "Rozwiązanie umowy bez wypowiedzenia z powodu niezdolności do pracy trwającej dłużej niż 3 miesiące (przy zatrudnieniu <6 mies.) lub dłużej niż okres zasiłkowy (przy ≥6 mies.)." },
  { name: "Art. 94 pkt 1-10", desc: "Obowiązki pracodawcy: zaznajamianie z obowiązkami, organizacja pracy, przeciwdziałanie dyskryminacji, bezpieczeństwo i higiena, terminowa wypłata wynagrodzenia, prowadzenie dokumentacji pracowniczej." },
  { name: "Art. 100 §1-2", desc: "Obowiązki pracownika: sumienne i staranne wykonywanie pracy, przestrzeganie czasu pracy, regulaminu, BHP, dbanie o mienie zakładu i tajemnicę." },
  { name: "Art. 128 §1", desc: "Czas pracy to czas, w którym pracownik pozostaje w dyspozycji pracodawcy w zakładzie pracy lub innym wyznaczonym miejscu." },
  { name: "Art. 151 §1", desc: "Praca w godzinach nadliczbowych – dopuszczalna w razie akcji ratowniczej lub szczególnych potrzeb pracodawcy." },
  { name: "Art. 152 §1", desc: "Pracownik ma prawo do corocznego, nieprzerwanego, płatnego urlopu wypoczynkowego i nie może się go zrzec." }
];

const UMOWA_ARTICLES = [
  { name: "Art. 25 §1", desc: "Rodzaje umów o pracę: na okres próbny, na czas określony lub na czas nieokreślony." },
  { name: "Art. 25¹ §1", desc: "Łączny okres zatrudnienia na czas określony między tymi samymi stronami nie może przekraczać 33 miesięcy, a liczba umów – trzech." },
  { name: "Art. 26", desc: "Stosunek pracy nawiązuje się w dniu określonym w umowie jako dzień rozpoczęcia pracy." },
  { name: "Art. 29 §1", desc: "Treść umowy o pracę – wymagane elementy: strony, rodzaj pracy, miejsce pracy, wynagrodzenie, wymiar czasu pracy, dzień rozpoczęcia." },
  { name: "Art. 30 §1-4", desc: "Rozwiązanie umowy – formy, forma pisemna, obowiązek wskazania przyczyny przez pracodawcę i pouczenie o odwołaniu do sądu pracy." },
  { name: "Art. 36 §1", desc: "Okres wypowiedzenia umowy na czas nieokreślony i określony zależy od stażu: 2 tygodnie (<6 mies.), 1 miesiąc (≥6 mies.), 3 miesiące (≥3 lata)." },
  { name: "Art. 38 §1", desc: "Pracodawca zawiadamia na piśmie zakładową organizację związkową o zamiarze wypowiedzenia umowy, podając przyczynę." },
  { name: "Art. 39", desc: "Ochrona przed wypowiedzeniem – pracodawca nie może wypowiedzieć umowy pracownikowi, któremu brakuje nie więcej niż 4 lata do wieku emerytalnego, jeśli ma staż uprawniający do emerytury." },
  { name: "Art. 45 §1", desc: "W razie nieuzasadnionego lub niezgodnego z prawem wypowiedzenia sąd pracy – na żądanie pracownika – orzeka o bezskuteczności wypowiedzenia lub przywróceniu do pracy albo odszkodowaniu." },
  { name: "Art. 55 §1", desc: "Pracownik może rozwiązać umowę bez wypowiedzenia, jeżeli orzeczenie lekarskie stwierdzi szkodliwy wpływ pracy na zdrowie, a pracodawca nie przeniesie go do innej odpowiedniej pracy." }
];

const SZKOLA_ARTICLES = [
  { name: "Art. 190 §1", desc: "Młodociany to osoba, która ukończyła 15 lat, a nie przekroczyła 18 lat. Zabronione jest zatrudnianie osób poniżej 15 lat." },
  { name: "Art. 191 §1", desc: "Zatrudnianie młodocianych wymaga ukończenia ośmioletniej szkoły podstawowej i świadectwa lekarskiego o braku przeciwwskazań do danej pracy." },
  { name: "Art. 197 §1", desc: "Pracownik młodociany obowiązany jest dokształcać się do ukończenia 18 lat." },
  { name: "Art. 198", desc: "Pracodawca obowiązany jest zwolnić młodocianego od pracy na czas potrzebny do udziału w zajęciach szkoleniowych związanych z dokształcaniem." },
  { name: "Art. 200¹ §1", desc: "Młodociany może być zatrudniony przy wykonywaniu lekkich prac, które nie zagrażają jego życiu, zdrowiu i rozwojowi ani nie utrudniają obowiązku szkolnego." },
  { name: "Art. 202 §1-2", desc: "Czas pracy młodocianego: do 16 lat – max 6 godzin na dobę; powyżej 16 lat – max 8 godzin na dobę." },
  { name: "Art. 203 §1", desc: "Młodocianego nie wolno zatrudniać w godzinach nadliczbowych ani w porze nocnej (dla młodocianych pora nocna: 22:00–6:00, a w niektórych przypadkach 20:00–6:00)." },
  { name: "Art. 204 §1", desc: "Nie wolno zatrudniać młodocianych przy pracach wzbronionych, których wykaz ustala Rada Ministrów." },
  { name: "Art. 205 §1-2", desc: "Urlop młodocianego: po 6 miesiącach pierwszej pracy – 12 dni roboczych; po roku pracy – 26 dni roboczych (w roku ukończenia 18 lat – 20 dni)." },
  { name: "Art. 206", desc: "Przepisy o zatrudnianiu młodocianych stosuje się odpowiednio do młodocianych zatrudnionych na podstawie umowy o przygotowanie zawodowe u rzemieślników." }
];

const URZAD_ARTICLES = [
  { name: "Art. 3", desc: "Pracodawcą jest jednostka organizacyjna (nawet bez osobowości prawnej) lub osoba fizyczna, jeżeli zatrudniają pracowników." },
  { name: "Art. 3¹ §1", desc: "Za pracodawcę będącego jednostką organizacyjną czynności w sprawach prawa pracy dokonuje osoba lub organ zarządzający tą jednostką albo wyznaczona do tego osoba." },
  { name: "Art. 184 §1", desc: "Nadzór i kontrolę przestrzegania prawa pracy (w tym BHP) sprawuje Państwowa Inspekcja Pracy." },
  { name: "Art. 185 §1", desc: "Społeczną kontrolę przestrzegania prawa pracy sprawuje społeczna inspekcja pracy." },
  { name: "Art. 239 pkt 2-3", desc: "Układu zbiorowego pracy nie zawiera się dla pracowników urzędów państwowych zatrudnionych na podstawie mianowania i powołania oraz dla pracowników samorządowych zatrudnionych na podstawie wyboru, mianowania i powołania." },
  { name: "Art. 240 §4", desc: "Zawarcie układu dla pracowników jednostek budżetowych i samorządowych zakładów budżetowych może nastąpić wyłącznie w ramach środków finansowych będących w ich dyspozycji." },
  { name: "Art. 77³ §1", desc: "Warunki wynagradzania pracowników państwowych jednostek sfery budżetowej (nieobjętych układem) określa w rozporządzeniu minister właściwy ds. pracy na wniosek właściwego ministra." },
  { name: "Art. 237¹¹ §1", desc: "Pracodawca zatrudniający >100 pracowników tworzy służbę BHP; przy ≤100 powierza zadania służby BHP pracownikowi przy innej pracy; przy ≤10 może sam wykonywać zadania." },
  { name: "Art. 237¹² §1", desc: "Pracodawca zatrudniający >250 pracowników powołuje komisję BHP jako organ doradczy i opiniodawczy, złożoną z równiej liczby przedstawicieli pracodawcy i pracowników." },
  { name: "Art. 281 §1 pkt 1-7", desc: "Wykroczenia przeciwko prawom pracownika (np. zawarcie umowy cywilnoprawnej zamiast o pracę, brak potwierdzenia umowy na piśmie, naruszenie przepisów o czasie pracy) – kara grzywny od 1000 zł do 30 000 zł." }
];

const NAJEM_ARTICLES = [
  { name: "Art. 114", desc: "Pracownik, który wskutek niewykonania lub nienależytego wykonania obowiązków ze swej winy wyrządził pracodawcy szkodę, ponosi odpowiedzialność materialną." },
  { name: "Art. 115", desc: "Odpowiedzialność pracownika ogranicza się do rzeczywistej straty poniesionej przez pracodawcę i normalnych następstw działania/zaniechania." },
  { name: "Art. 116", desc: "Pracodawca jest obowiązany wykazać okoliczności uzasadniające odpowiedzialność pracownika oraz wysokość szkody." },
  { name: "Art. 117 §1", desc: "Pracownik nie ponosi odpowiedzialności za szkodę w zakresie, w jakim pracodawca lub inna osoba przyczynili się do jej powstania albo zwiększenia." },
  { name: "Art. 119", desc: "Odszkodowanie nie może przewyższać kwoty trzymiesięcznego wynagrodzenia pracownika w dniu wyrządzenia szkody." },
  { name: "Art. 122", desc: "Jeżeli pracownik umyślnie wyrządził szkodę, jest obowiązany do jej naprawienia w pełnej wysokości (bez ograniczenia z art. 119)." },
  { name: "Art. 124 §1", desc: "Pracownik, któremu powierzono z obowiązkiem zwrotu lub wyliczenia się pieniądze, papiery wartościowe, kosztowności, narzędzia itp., odpowiada w pełnej wysokości za szkodę w tym mieniu." },
  { name: "Art. 125 §1", desc: "Pracownicy mogą przyjąć wspólną odpowiedzialność materialną za mienie powierzone im łącznie na podstawie umowy o współodpowiedzialności materialnej (forma pisemna pod rygorem nieważności)." },
  { name: "Art. 126 §1", desc: "Rada Ministrów określi zakres i szczegółowe zasady stosowania przepisów o wspólnej odpowiedzialności materialnej oraz tryb łącznego powierzania mienia." },
  { name: "Art. 127", desc: "Do odpowiedzialności za mienie powierzone stosuje się odpowiednio przepisy o przyczynieniu się pracodawcy do szkody (art. 117), obniżeniu odszkodowania (art. 121) i odpowiedzialności umyślnej (art. 122)." }
];

const REKLAMACJA_ARTICLES = [
  { name: "Art. 44", desc: "Pracownik może wnieść odwołanie od wypowiedzenia umowy o pracę do sądu pracy." },
  { name: "Art. 45 §1", desc: "W razie nieuzasadnionego lub naruszającego przepisy wypowiedzenia sąd – na żądanie pracownika – orzeka o bezskuteczności wypowiedzenia, przywróceniu do pracy lub odszkodowaniu." },
  { name: "Art. 47", desc: "Pracownikowi przywróconemu do pracy przysługuje wynagrodzenie za czas pozostawania bez pracy (nie więcej niż za 2 miesiące, a przy 3-miesięcznym wypowiedzeniu – za 1 miesiąc). W przypadku pracowników chronionych (np. w ciąży) – za cały czas." },
  { name: "Art. 56 §1", desc: "Pracownik, z którym rozwiązano umowę bez wypowiedzenia z naruszeniem przepisów, ma roszczenie o przywrócenie do pracy lub odszkodowanie." },
  { name: "Art. 57 §1", desc: "Przywróconemu do pracy przysługuje wynagrodzenie za czas pozostawania bez pracy, nie więcej niż za 3 miesiące i nie mniej niż za 1 miesiąc." },
  { name: "Art. 58", desc: "Odszkodowanie w przypadku niezgodnego rozwiązania umowy bez wypowiedzenia wynosi wynagrodzenie za okres wypowiedzenia (dla umowy na czas określony – za czas do końca umowy, nie więcej niż za okres wypowiedzenia)." },
  { name: "Art. 61¹", desc: "W razie nieuzasadnionego rozwiązania przez pracownika umowy o pracę bez wypowiedzenia (na podstawie art. 55 §1¹), pracodawcy przysługuje roszczenie o odszkodowanie." },
  { name: "Art. 99 §1", desc: "Pracownikowi przysługuje roszczenie o naprawienie szkody wyrządzonej przez pracodawcę wskutek niewydania w terminie lub wydania niewłaściwego świadectwa pracy." },
  { name: "Art. 264 §1", desc: "Odwołanie od wypowiedzenia umowy o pracę wnosi się do sądu pracy w ciągu 21 dni od dnia doręczenia pisma wypowiadającego." },
  { name: "Art. 291 §1", desc: "Roszczenia ze stosunku pracy ulegają przedawnieniu z upływem 3 lat od dnia, w którym roszczenie stało się wymagalne." }
];

const CATEGORIES_DATA: Record<string, Array<{ name: string; desc: string }>> = {
  "Praca": PRACA_ARTICLES,
  "Umowa": UMOWA_ARTICLES,
  "Szkoła": SZKOLA_ARTICLES,
  "Urząd": URZAD_ARTICLES,
  "Najem": NAJEM_ARTICLES,
  "Reklamacja": REKLAMACJA_ARTICLES,
};

export default function RightsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Funkcja filtrowania artykułów
  const filterArticles = (articles: Array<{ name: string; desc: string }>) => {
    if (!query.trim()) return articles;
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (article) =>
        article.name.toLowerCase().includes(lowerQuery) ||
        article.desc.toLowerCase().includes(lowerQuery)
    );
  };

  // Pobierz artykuły na podstawie zapytania
  const getSearchResults = () => {
    if (!query.trim()) return null;
    
    const results: { category: string; articles: Array<{ name: string; desc: string }> }[] = [];
    Object.entries(CATEGORIES_DATA).forEach(([category, articles]) => {
      const filtered = filterArticles(articles);
      if (filtered.length > 0) {
        results.push({ category, articles: filtered });
      }
    });
    return results;
  };

  const searchResults = getSearchResults();
  const currentArticles = selectedCategory ? filterArticles(CATEGORIES_DATA[selectedCategory]) : null;

  return (
    <ServiceScreen eyebrow="Samodzielność" title="Twoje prawa" description="Wyszukaj podstawowe informacje i sprawdź kategorie wsparcia.">
      <div className="service-form">
        <label className="search-field">
          <Search size={18} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj prawa, tematu lub instytucji..." />
        </label>

        {selectedCategory && !query.trim() && (
          <button 
            type="button" 
            className="back-button"
            onClick={() => setSelectedCategory(null)}
          >
            <ArrowLeft size={18} />
            <span>Wróć</span>
          </button>
        )}

        {query.trim() && (
          <button 
            type="button" 
            className="back-button"
            onClick={() => {
              setQuery("");
              setSelectedCategory(null);
            }}
          >
            <ArrowLeft size={18} />
            <span>Wyczyść wyszukiwanie</span>
          </button>
        )}

        {!selectedCategory && !query.trim() && (
          <div className="category-grid">
            {Object.keys(CATEGORIES_DATA).map((item) => (
              <button 
                key={item} 
                type="button" 
                className="category-card"
                onClick={() => setSelectedCategory(item)}
              >
                <Scale size={18} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        )}

        {query.trim() && searchResults && searchResults.length > 0 && (
          <div className="search-results">
            <h3>Wyniki wyszukiwania ({searchResults.reduce((sum, r) => sum + r.articles.length, 0)})</h3>
            {searchResults.map((result) => (
              <div key={result.category} className="category-data">
                <h4 style={{ marginTop: "16px" }}>{result.category}</h4>
                <div className="articles-list">
                  {result.articles.map((article, idx) => (
                    <div key={idx} className="article-card">
                      <div className="article-name">{article.name}</div>
                      <div className="article-desc">{article.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {query.trim() && (!searchResults || searchResults.length === 0) && (
          <div className="no-results">
            <p>Brak wyników dla: "{query}"</p>
          </div>
        )}

        {!query.trim() && selectedCategory && currentArticles && (
          <div className="category-data">
            <h3>{selectedCategory} - Artykuły</h3>
            <div className="articles-list">
              {currentArticles.map((article, idx) => (
                <div key={idx} className="article-card">
                  <div className="article-name">{article.name}</div>
                  <div className="article-desc">{article.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ServiceScreen>
  );
}
