"use client";

import { useState } from "react";
import { Scale, Search, ArrowLeft } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

const PRACA_ARTICLES = [
  { name: "Art. 22 §1 KP", desc: "Definicja stosunku pracy: pracownik zobowiązuje się do pracy pod kierownictwem pracodawcy, a pracodawca do zatrudniania za wynagrodzeniem." },
  { name: "Art. 29 §1 KP", desc: "Umowa o pracę określa strony, rodzaj pracy, miejsce pracy, wynagrodzenie, wymiar czasu pracy i dzień rozpoczęcia pracy." },
  { name: "Art. 30 §1-4 KP", desc: "Sposoby rozwiązania umowy o pracę: porozumienie, wypowiedzenie, rozwiązanie bez wypowiedzenia albo upływ czasu, na jaki umowa została zawarta." },
  { name: "Art. 52 §1 KP", desc: "Pracodawca może rozwiązać umowę bez wypowiedzenia z winy pracownika m.in. za ciężkie naruszenie obowiązków, przestępstwo lub utratę uprawnień." },
  { name: "Art. 53 §1 KP", desc: "Przepisy przewidują rozwiązanie umowy bez wypowiedzenia z powodu długotrwałej niezdolności pracownika do pracy." },
  { name: "Art. 94 KP", desc: "Kodeks określa podstawowe obowiązki pracodawcy, m.in. organizację pracy, przeciwdziałanie dyskryminacji i terminową wypłatę wynagrodzenia." },
  { name: "Art. 100 §1-2 KP", desc: "Pracownik ma obowiązek wykonywać pracę sumiennie i starannie, przestrzegać regulaminu, czasu pracy i zasad BHP." },
  { name: "Art. 128 §1 KP", desc: "Czas pracy to czas, w którym pracownik pozostaje w dyspozycji pracodawcy w zakładzie pracy lub innym wyznaczonym miejscu." },
  { name: "Art. 151 §1 KP", desc: "Praca w godzinach nadliczbowych jest dopuszczalna m.in. przy akcji ratowniczej albo szczególnych potrzebach pracodawcy." },
  { name: "Art. 152 §1 KP", desc: "Pracownik ma prawo do corocznego, nieprzerwanego i płatnego urlopu wypoczynkowego, którego nie może się zrzec." },
];

const UMOWA_ARTICLES = [
  { name: "Art. 60 KC", desc: "Oświadczenie woli może być wyrażone przez każde zachowanie, które ujawnia wolę w sposób dostateczny, także elektronicznie." },
  { name: "Art. 66 §1 KC", desc: "Oświadczenie drugiej stronie woli zawarcia umowy stanowi ofertę, jeżeli określa istotne postanowienia tej umowy." },
  { name: "Art. 66(1) §1-2 KC", desc: "Przy umowach zawieranych elektronicznie przedsiębiorca powinien jasno opisać procedurę zawarcia umowy i potwierdzić otrzymanie oferty." },
  { name: "Art. 70(1) KC", desc: "Umowa może zostać zawarta także w drodze aukcji albo przetargu, jeżeli strony wybierają taki tryb." },
  { name: "Art. 353(1) KC", desc: "Strony mogą ułożyć stosunek prawny według swojego uznania, byle treść lub cel umowy nie sprzeciwiały się ustawie ani zasadom współżycia społecznego." },
  { name: "Art. 354 KC", desc: "Zobowiązanie powinno być wykonywane zgodnie z jego treścią, celem społeczno-gospodarczym oraz zasadami współżycia społecznego." },
  { name: "Art. 471 KC", desc: "Strona, która nie wykonała albo nienależycie wykonała umowę, co do zasady odpowiada za wynikłą z tego szkodę." },
  { name: "Art. 483 §1 KC", desc: "W umowie można zastrzec karę umowną za niewykonanie lub nienależyte wykonanie zobowiązania niepieniężnego." },
  { name: "Art. 484 §1 KC", desc: "W razie naruszenia umowy wierzyciel może żądać kary umownej w zastrzeżonej wysokości." },
  { name: "Art. 385(1) §1 KC", desc: "Niedozwolone postanowienia w umowie z konsumentem nie wiążą konsumenta, jeśli nie były z nim indywidualnie uzgodnione." },
];

const SZKOLA_ARTICLES = [
  { name: "Art. 35 ust. 1-2 Prawa oświatowego", desc: "Nauka jest obowiązkowa do ukończenia 18. roku życia, a obowiązek szkolny spełnia się przez uczęszczanie do szkoły podstawowej." },
  { name: "Art. 36 Prawa oświatowego", desc: "Przepisy określają sposoby spełniania obowiązku szkolnego i obowiązku nauki, także poza szkołą w określonych przypadkach." },
  { name: "Art. 85 ust. 1-5 Prawa oświatowego", desc: "W szkole działa samorząd uczniowski reprezentujący wszystkich uczniów i mogący przedstawiać wnioski oraz opinie organom szkoły." },
  { name: "Art. 86 Prawa oświatowego", desc: "W szkole mogą działać stowarzyszenia i organizacje wspierające działalność wychowawczą, opiekuńczą i edukacyjną, za zgodą dyrektora." },
  { name: "Art. 98 ust. 1 Prawa oświatowego", desc: "Statut szkoły określa organizację szkoły oraz prawa i obowiązki uczniów." },
  { name: "Art. 99 Prawa oświatowego", desc: "Prawa i obowiązki ucznia, rodzaje nagród i kar oraz tryb odwołania od kary powinny wynikać ze statutu szkoły." },
  { name: "Art. 106 Prawa oświatowego", desc: "Szkoła może organizować stołówkę, aby wspierać prawidłową realizację zadań opiekuńczych i rozwój uczniów." },
  { name: "Art. 125 Prawa oświatowego", desc: "Uczeń z orzeczeniem o potrzebie kształcenia specjalnego ma prawo do organizacji nauki i wsparcia dostosowanych do jego potrzeb." },
  { name: "Art. 130 ust. 1 Prawa oświatowego", desc: "Przyjęcie do publicznej szkoły lub placówki odbywa się co do zasady w postępowaniu rekrutacyjnym opartym na ustawowych kryteriach." },
  { name: "Art. 134 ust. 1 Prawa oświatowego", desc: "Do klas pierwszych publicznych szkół ponadpodstawowych kandydaci są przyjmowani po przeprowadzeniu postępowania rekrutacyjnego." },
];

const URZAD_ARTICLES = [
  { name: "Art. 6 KPA", desc: "Organy administracji publicznej działają na podstawie przepisów prawa." },
  { name: "Art. 7 KPA", desc: "Urząd powinien dokładnie wyjaśnić stan faktyczny sprawy i załatwić ją z uwzględnieniem interesu społecznego oraz słusznego interesu obywateli." },
  { name: "Art. 8 KPA", desc: "Postępowanie powinno budzić zaufanie do władzy publicznej i być prowadzone w sposób proporcjonalny, bezstronny i równo traktujący strony." },
  { name: "Art. 9 KPA", desc: "Organ ma obowiązek należycie informować strony o okolicznościach faktycznych i prawnych wpływających na ich prawa i obowiązki." },
  { name: "Art. 35 KPA", desc: "Sprawy powinny być załatwiane bez zbędnej zwłoki, a przepisy określają podstawowe terminy dla urzędu." },
  { name: "Art. 36 KPA", desc: "Jeżeli urząd nie może załatwić sprawy w terminie, powinien zawiadomić o przyczynach opóźnienia i wskazać nowy termin." },
  { name: "Art. 61 KPA", desc: "Postępowanie administracyjne wszczyna się na żądanie strony albo z urzędu." },
  { name: "Art. 63 KPA", desc: "Podanie do urzędu można złożyć m.in. pisemnie, elektronicznie albo ustnie do protokołu." },
  { name: "Art. 73 §1 KPA", desc: "Strona ma prawo wglądu w akta sprawy oraz sporządzania z nich notatek, kopii i odpisów." },
  { name: "Art. 127 KPA", desc: "Od decyzji wydanej w pierwszej instancji co do zasady służy odwołanie do organu wyższego stopnia." },
];

const NAJEM_ARTICLES = [
  { name: "Art. 659 §1 KC", desc: "Przez umowę najmu wynajmujący oddaje rzecz do używania, a najemca zobowiązuje się płacić umówiony czynsz." },
  { name: "Art. 662 §1 KC", desc: "Wynajmujący powinien wydać najemcy rzecz w stanie przydatnym do umówionego użytku i utrzymywać ją w takim stanie przez czas najmu." },
  { name: "Art. 664 §1-2 KC", desc: "Jeżeli lokal ma wady ograniczające jego przydatność, najemca może żądać obniżenia czynszu, a przy wadach istotnych także wypowiedzieć najem bez zachowania terminów." },
  { name: "Art. 668 §1 KC", desc: "Najemca może oddać rzecz w podnajem albo do bezpłatnego używania, jeżeli umowa mu tego nie zabrania." },
  { name: "Art. 673 §1-3 KC", desc: "Najem zawarty na czas nieoznaczony można wypowiedzieć z zachowaniem terminów ustawowych lub umownych, a na czas oznaczony tylko w przypadkach przewidzianych w umowie." },
  { name: "Art. 675 §1-3 KC", desc: "Po zakończeniu najmu najemca powinien zwrócić rzecz w stanie niepogorszonym, z uwzględnieniem zwykłego zużycia." },
  { name: "Art. 676 KC", desc: "Jeżeli najemca ulepszył lokal, wynajmujący może zatrzymać ulepszenia za zapłatą ich wartości albo żądać przywrócenia stanu poprzedniego." },
  { name: "Art. 680(1) §1 KC", desc: "Małżonkowie mogą stać się wspólnie najemcami lokalu służącego zaspokojeniu potrzeb mieszkaniowych rodziny, nawet gdy umowę formalnie zawarła jedna osoba." },
  { name: "Art. 687 KC", desc: "Gdy najemca lokalu zwleka z czynszem co najmniej za dwa pełne okresy płatności, wynajmujący może wypowiedzieć najem po uprzedzeniu i wyznaczeniu dodatkowego terminu do zapłaty." },
  { name: "Art. 6a ust. 1 ustawy o ochronie praw lokatorów", desc: "Wynajmujący ma obowiązek zapewnić sprawne działanie istniejących instalacji i elementów wyposażenia lokalu związanych z korzystaniem z mieszkania." },
];

const REKLAMACJA_ARTICLES = [
  { name: "Art. 7a ustawy o prawach konsumenta", desc: "Jeżeli przedsiębiorca nie odpowie na reklamację konsumenta w terminie 14 dni, uznaje się, że ją zaakceptował." },
  { name: "Art. 27 ustawy o prawach konsumenta", desc: "Przy umowie zawartej na odległość lub poza lokalem przedsiębiorcy konsument może odstąpić od umowy w terminie 14 dni bez podawania przyczyny." },
  { name: "Art. 28 ustawy o prawach konsumenta", desc: "Przepis określa, od kiedy liczy się termin 14 dni na odstąpienie od umowy, zależnie od rodzaju umowy i sposobu dostawy." },
  { name: "Art. 34 ust. 1-2 ustawy o prawach konsumenta", desc: "Po odstąpieniu od umowy konsument powinien zwrócić towar, a przedsiębiorca co do zasady zwraca wszystkie dokonane płatności." },
  { name: "Art. 38 ustawy o prawach konsumenta", desc: "Ustawa wskazuje wyjątki, kiedy prawo odstąpienia od umowy nie przysługuje, np. przy towarach robionych na zamówienie lub szybko psujących się." },
  { name: "Art. 43a ust. 1 ustawy o prawach konsumenta", desc: "Jeżeli towar jest niezgodny z umową, konsumentowi przysługują uprawnienia reklamacyjne określone w ustawie." },
  { name: "Art. 43b ust. 1 ustawy o prawach konsumenta", desc: "Towar jest zgodny z umową, gdy zgadzają się m.in. jego opis, ilość, jakość, kompletność, funkcjonalność i przydatność do celu." },
  { name: "Art. 43d ust. 1-3 ustawy o prawach konsumenta", desc: "Konsument może żądać naprawy albo wymiany towaru, a przedsiębiorca powinien zrobić to w rozsądnym czasie i bez nadmiernych niedogodności." },
  { name: "Art. 43e ust. 1 ustawy o prawach konsumenta", desc: "Jeżeli naprawa lub wymiana są niemożliwe albo nieskuteczne, konsument może żądać obniżenia ceny albo odstąpić od umowy." },
  { name: "Art. 43f ustawy o prawach konsumenta", desc: "Przedsiębiorca powinien zwrócić kwoty należne konsumentowi po uznaniu reklamacji niezwłocznie, nie później niż w terminie 14 dni." },
];

const CATEGORIES_DATA: Record<string, Array<{ name: string; desc: string }>> = {
  Praca: PRACA_ARTICLES,
  Umowa: UMOWA_ARTICLES,
  Szkoła: SZKOLA_ARTICLES,
  Urząd: URZAD_ARTICLES,
  Najem: NAJEM_ARTICLES,
  Reklamacja: REKLAMACJA_ARTICLES,
};

export default function RightsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filterArticles = (articles: Array<{ name: string; desc: string }>) => {
    if (!query.trim()) return articles;
    const lowerQuery = query.toLowerCase();

    return articles.filter(
      (article) =>
        article.name.toLowerCase().includes(lowerQuery) ||
        article.desc.toLowerCase().includes(lowerQuery)
    );
  };

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
          <button type="button" className="back-button" onClick={() => setSelectedCategory(null)}>
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
              <button key={item} type="button" className="category-card" onClick={() => setSelectedCategory(item)}>
                <Scale size={18} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        )}

        {query.trim() && searchResults && searchResults.length > 0 && (
          <div className="search-results">
            <h3>Wyniki wyszukiwania ({searchResults.reduce((sum, result) => sum + result.articles.length, 0)})</h3>
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
            <p>Brak wyników dla: &quot;{query}&quot;</p>
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
