import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import "./searchbar.css";
import type { AppState } from "../../types";

type SearchBarProps = {
  updateExhibits: (items: unknown[]) => void;
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

export default function SearchBar({
  updateExhibits,
  appState,
  setAppState,
}: SearchBarProps) {
  const [inputData, setInputData] = useState("");
  const isSearching = appState.isSearching;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setAppState({ isSearching: true });
    e.preventDefault();
    search2();
  };

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const search2 = () => {
    const page = getRandomInt(20);
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`)
      .then((response) => response.json())
      .then((json) => updateExhibits(json))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(`Is searching: ${isSearching}`);
    console.log("Searchbar effect started");
  }, [isSearching]);

  return (
    <form
      className="searchbar-container"
      onSubmit={handleSubmit}
      method="post"
      tabIndex={1}
    >
      <div className="searchbar-container-wrapper">
        <input
          disabled={isSearching}
          className="searchbar-input"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          name="query"
        />
        <button
          disabled={isSearching}
          className="searchbar-button"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
