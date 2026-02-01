import "./App.css";
import GalleryContainer from "./components/GalleryContainer/gallerycontainer";
import NavBar from "./components/NavBar/navbar";
import FadeInText from "./components/fadeintext";
import Footer from "./components/Footer/Footer";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { AppState, Exhibit } from "./types";

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
  sortOrder: SortOrder
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
  const pageNumber = Number(page) || 1;
  const normalizedPage = pageNumber > 0 ? pageNumber : 1;
  const isHome = normalizedPage === 1;
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [normalizedPage]);

  useEffect(() => {
    let cancelled = false;
    const limit = 30;
    const offset = (normalizedPage - 1) * limit;
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      sort: sortKey,
      order: sortOrder,
    });
    const apiBase =
      "https://cma-gallery-worker.cheezy2000.workers.dev/api/exhibits";
    const url =
      normalizedPage === 1
        ? "/response.json"
        : `${apiBase}?${params.toString()}`;

    setAppState((prev) => ({ ...prev, isSearching: true }));

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        const items = json.items ?? [];
        setExhibits(sortExhibits(items, sortKey, sortOrder));
      })
      .catch((error) => {
        if (cancelled) return;
        console.log(error);
        setExhibits([]);
      })
      .finally(() => {
        if (cancelled) return;
        setAppState((prev) => ({ ...prev, isSearching: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedPage, setAppState, setExhibits, sortKey, sortOrder]);

  return (
    <div className="app-wrapper">
      <NavBar firstExhibitId={exhibits[0]?.id} />
      {isHome && (
        <header>
          <div className="overlay-box" />
          <FadeInText className="header-title-container" staggerMs={2000}>
            <h1 className="header-title">
              A MODERN <br /> ART GALLERY
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
          <h2 className="section-title">Title here</h2>
        </section>
      )}
      <main>
        <div className="gallery-controls">
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
        <GalleryContainer
          appState={appState}
          exhibits={exhibits}
        ></GalleryContainer>
      </main>
      <Footer page={normalizedPage} />
    </div>
  );
}

export default App;
