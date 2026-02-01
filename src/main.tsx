import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import InnerPage from "./routes/InnerPage/InnerPage.tsx";
import type { AppState, Exhibit } from "./types";

function AppRoutes() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [appState, setAppState] = useState<AppState>({ isSearching: false });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <App
            exhibits={exhibits}
            setExhibits={setExhibits}
            appState={appState}
            setAppState={setAppState}
          />
        }
      ></Route>
      <Route
        path="/page/:page"
        element={
          <App
            exhibits={exhibits}
            setExhibits={setExhibits}
            appState={appState}
            setAppState={setAppState}
          />
        }
      />
      <Route
        path="/exhibit/:eid"
        element={<InnerPage exhibits={exhibits} />}
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);
