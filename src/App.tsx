import "./App.css";
import AiChat from "./components/AiChat/AiChat";
import GalleryContainer from "./components/GalleryContainer/gallerycontainer";
import NavBar from "./components/NavBar/navbar";
import FadeInText from "./components/fadeintext";
import Footer from "./components/Footer/Footer";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { AppState, Exhibit } from "./types";
import { buildExhibitsUrl } from "./api";

type AppProps = {
  exhibits: Exhibit[];
  setExhibits: Dispatch<SetStateAction<Exhibit[]>>;
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

type SortKey = "title" | "creation_year_earliest";
type SortOrder = "asc" | "desc";

const sortExhibits = (
  items: Exhibit[],
  sortKey: SortKey,
  sortOrder: SortOrder,
) => {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortKey === "title") {
      const left = a.title ?? "";
      const right = b.title ?? "";
      const result = left.localeCompare(right);
      return sortOrder === "asc" ? result : -result;
    }

    const left = a.creation_year_earliest ?? Number.POSITIVE_INFINITY;
    const right = b.creation_year_earliest ?? Number.POSITIVE_INFINITY;
    const result = left - right;
    return sortOrder === "asc" ? result : -result;
  });
  return sorted;
};

function App({ exhibits, setExhibits, appState, setAppState }: AppProps) {
  const { page } = useParams();
  const location = useLocation();
  const pageNumber = Number(page) || 1;
  const normalizedPage = pageNumber > 0 ? pageNumber : 1;
  const isHome = normalizedPage === 1;
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [baseExhibits, setBaseExhibits] = useState<Exhibit[]>([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrefill, setAiPrefill] = useState("");
  const [aiPrefillKey, setAiPrefillKey] = useState(0);
  const aiActiveRef = useRef(isAiActive);
  const aiIcon = `${import.meta.env.BASE_URL}assets/AI icon.svg`;
  const StarsIcon = `${import.meta.env.BASE_URL}assets/Stars.svg`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [normalizedPage]);

  useEffect(() => {
    if (!exhibits || exhibits.length === 0) return;
    try {
      sessionStorage.setItem("gallery:lastExhibits", JSON.stringify(exhibits));
    } catch (error) {
      console.log(error);
    }
  }, [exhibits]);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    try {
      sessionStorage.setItem("gallery:lastPath", path);
    } catch (error) {
      console.log(error);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    aiActiveRef.current = isAiActive;
  }, [isAiActive]);

  useEffect(() => {
    let cancelled = false;
    const limit = 30;
    const offset = (normalizedPage - 1) * limit;
    const url =
      normalizedPage === 1
        ? "/response.json"
        : buildExhibitsUrl({
            limit: String(limit),
            offset: String(offset),
            sort: sortKey,
            order: sortOrder,
          });

    setAppState((prev) => ({ ...prev, isSearching: true }));

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        const items = json.items ?? [];
        const sortedItems = sortExhibits(items, sortKey, sortOrder);
        setBaseExhibits(sortedItems);
        if (!aiActiveRef.current) {
          setExhibits(sortedItems);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.log(error);
        setBaseExhibits([]);
        if (!aiActiveRef.current) {
          setExhibits([]);
        }
      })
      .finally(() => {
        if (cancelled) return;
        setAppState((prev) => ({ ...prev, isSearching: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedPage, setAppState, setExhibits, sortKey, sortOrder]);

  const scrollToGallery = () => {
    const target = document.getElementById("gallery-section-title");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAiResults = (_response: string, aiExhibits: Exhibit[]) => {
    setIsAiActive(true);
    setExhibits(aiExhibits);
    scrollToGallery();
  };

  const handleClearAiResults = () => {
    setIsAiActive(false);
    setExhibits(baseExhibits);
  };

  const aiPrompts = [
    "Disturbing art",
    "Nature, landscapes and flowers",
    "Myth and folklore",
    "Quiet portraits",
  ];

  const handlePromptClick = (prompt: string) => {
    setAiPrefill(prompt);
    setAiPrefillKey((prev) => prev + 1);
    setIsAiOpen(true);
  };

  return (
    <div className="app-wrapper">
      <NavBar firstExhibitId={exhibits[0]?.id} />
      {isHome && (
        <header>
          <div className="overlay-box" />
          <FadeInText className="header-title-container" staggerMs={2000}>
            <h1 className="header-title">
              WELCOME TO
              <br /> GALLERIA <br />
              ART GALLERY
            </h1>
          </FadeInText>
          <FadeInText>
            <p className="header-p">
              The arts in the collection of Cleveland Museum Of Art all started
              from a spark of inspiration. <br /> Will these pieces inspire you?
            </p>
          </FadeInText>
        </header>
      )}
      {isHome && (
        <section className="home-section">
          <div className="home-section__content">
            <div className="home-section__text">
              <p className="home-section__eyebrow">New</p>
              <h2 className="home-section__title">Meet Your AI Curator</h2>
              <p className="home-section__body">
                Describe the mood or theme you want to explore and get a curated
                set of exhibits instantly.
              </p>
              <div className="home-section__actions">
                <button
                  className="home-section__cta"
                  type="button"
                  onClick={() => {
                    setAiPrefill("");
                    setIsAiOpen(true);
                  }}
                >
                  Try AI Search
                </button>
                <span className="home-section__hint">
                  or tap a prompt below
                </span>
              </div>
              <div className="home-section__prompts">
                {aiPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="home-section__prompt"
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className="home-section__visual">
              <img src={StarsIcon} alt="" aria-hidden="true" />
            </div>
          </div>
        </section>
      )}
      <main>
        <div className="gallery-controls">
          <h1 id="gallery-section-title">Exhibits</h1>
          {isAiActive && (
            <div className="gallery-controls__tag">
              <span>AI results</span>
              <button
                type="button"
                className="gallery-controls__tag-close"
                onClick={handleClearAiResults}
                aria-label="Clear AI results"
              >
                x
              </button>
            </div>
          )}
          <div className="gallery-controls__wrapper">
            <div className="gallery-controls__group">
              <label className="gallery-controls__label" htmlFor="sort-key">
                Sort by
              </label>
              <select
                id="sort-key"
                className="gallery-controls__select"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
              >
                <option value="title">Title</option>
                <option value="creation_year_earliest">Year</option>
              </select>
            </div>
            <div className="gallery-controls__group">
              <label className="gallery-controls__label" htmlFor="sort-order">
                Order
              </label>
              <select
                id="sort-order"
                className="gallery-controls__select"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        <GalleryContainer
          appState={appState}
          exhibits={exhibits}
        ></GalleryContainer>
      </main>
      <Footer page={normalizedPage} />
      <AiChat
        onResults={handleAiResults}
        isOpen={isAiOpen}
        onToggle={setIsAiOpen}
        prefill={aiPrefill}
        prefillKey={aiPrefillKey}
      />
    </div>
  );
}

export default App;
