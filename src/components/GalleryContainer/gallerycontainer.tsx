import "./gridcontainer.css";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppState, Exhibit } from "../../types";

type LoadedImage = {
  id: string;
  src: string;
  colSpan: number;
  rowSpan: number;
  title: string;
  artist: string;
  type: string;
  technique: string;
};

type GalleryProps = {
  exhibits?: Exhibit[];
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

function GalleryContainer({ exhibits, appState, setAppState }: GalleryProps) {
  const [images, setImages] = useState<LoadedImage[]>([]);
  const isLoading = appState.isSearching;
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const createdImages: HTMLImageElement[] = [];

    console.log(exhibits);

    if (!exhibits || exhibits.length === 0) {
      setImages([]);
      return;
    }

    const randomSpan = () => {
      const minSpan = 1;
      const maxSpan = 2;
      const span =
        Math.floor(Math.random() * (maxSpan - minSpan + 1)) + minSpan;
      return span;
    };

    const loadImage = (src: string) =>
      new Promise<string>((resolve) => {
        const img = new Image();
        createdImages.push(img);
        const finish = () => resolve(src);
        img.onload = finish;
        img.onerror = finish;
        img.src = src;
      });

    setAppState((prev) => ({ ...prev, isSearching: true }));

    Promise.all(exhibits.map((exhibit) => loadImage(exhibit.image_url)))
      .then((loadedSrcs) => {
        if (cancelled) return;

        const sizedImages = loadedSrcs.map((src, index) => {
          const exhibit = exhibits[index];
          if (!exhibit) {
            return {
              id: src,
              src,
              colSpan: randomSpan(),
              rowSpan: randomSpan(),
              title: "Untitled",
              artist: "Unknown artist",
              type: "",
              technique: "",
            };
          }

          return {
            id: String(exhibit.exhibit_id),
            src,
            colSpan: randomSpan(),
            rowSpan: randomSpan(),
            title: exhibit.title,
            artist: exhibit.artist,
            type: exhibit.type,
            technique: exhibit.technique,
          };
        });

        setImages(sizedImages);
        setAppState((prev) => ({ ...prev, isSearching: false }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        setAppState((prev) => ({ ...prev, isSearching: false }));
      });

    return () => {
      cancelled = true;
      createdImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
    };
  }, [exhibits]);

  return (
    <div className="grid-container">
      {!isLoading &&
        images.length > 0 &&
        images.map((image) => {
          return (
            <div
              onClick={() => {
                navigate(`/exhibit/${image.id}`);
              }}
              key={image.id}
              className="exhibit-container"
              style={{
                gridRowEnd: `span ${image.rowSpan}`,
                gridColumnEnd: `span ${image.colSpan}`,
              }}
            >
              <img className="exhibit" src={image.src}></img>
              <div className="exhibit-info">
                <h1 className="exhibit-info-title">{image.title}</h1>
                <h2 className="exhibit-info-artist">{image.artist}</h2>
              </div>
            </div>
          );
        })}

      {isLoading && <p>Loading</p>}
    </div>
  );
}

export default GalleryContainer;
