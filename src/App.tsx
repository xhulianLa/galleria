import "./App.css";
import SearchBar from "./components/SearchBar/searchbar";
import GalleryContainer from "./components/GalleryContainer/gallerycontainer";
import NavBar from "./components/NavBar/navbar";
import { useEffect, useState } from "react";
import FadeInText from "./components/fadeintext";
import { Outlet } from "react-router-dom";

function App() {
  interface AppState {
    isSearching: boolean;
  }

  const [exhibits, setExhibits] = useState();
  const [state, setState] = useState<AppState>({ isSearching: false });

  useEffect(() => {
    fetch("response.json")
      .then((response) => response.json())
      .then((json) => setExhibits(json.results))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="app-wrapper">
      <NavBar />
      <header>
        <div className="overlay-box" />
        <FadeInText className="header-title-container" staggerMs={2000}>
          <h1 className="header-title">
            A MODERN <br /> ART GALLERY
          </h1>
        </FadeInText>
      </header>
      <main>
        <GalleryContainer
          appState={state}
          setAppState={setState}
          exhibits={exhibits}
        ></GalleryContainer>
        <SearchBar
          appState={state}
          setAppState={setState}
          updateExhibits={setExhibits}
        ></SearchBar>
      </main>
    </div>
  );
}

export default App;
