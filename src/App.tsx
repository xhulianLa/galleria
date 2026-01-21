import "./App.css";
import SearchBar from "./components/SearchBar/searchbar";
import GalleryContainer from "./components/GalleryContainer/gallerycontainer";
import NavBar from "./components/NavBar/navbar";
import FadeInText from "./components/fadeintext";
import type { Dispatch, SetStateAction } from "react";
import type { AppState, Exhibit } from "./types";

type AppProps = {
  exhibits: Exhibit[];
  setExhibits: Dispatch<SetStateAction<Exhibit[]>>;
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

function App({ exhibits, setExhibits, appState, setAppState }: AppProps) {
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
          appState={appState}
          setAppState={setAppState}
          exhibits={exhibits}
        ></GalleryContainer>
        <SearchBar
          appState={appState}
          setAppState={setAppState}
          updateExhibits={setExhibits}
        ></SearchBar>
      </main>
    </div>
  );
}

export default App;
