import "./gridcontainer.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppState, Exhibit } from "../../types";

const FADE_MS = 300;

type LoadedImage = {
  id: string;
  src: string;
  colSpan: number;
  rowSpan: number;
  title: string;
  artist: string;
  isLoaded: boolean;
  isExiting: boolean;
};

type GalleryProps = {
  exhibits?: Exhibit[];
  appState: AppState;
};

function GalleryContainer({ exhibits, appState }: GalleryProps) {
  const [images, setImages] = useState<LoadedImage[]>([]);
  const isLoading = appState.isSearching;
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<number | undefined>(undefined);
  const imagesRef = useRef<LoadedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    if (!exhibits || exhibits.length === 0) {
      setImages([]);
      return;
    }

    const randomSpan = () => {
      const minSpan = 0;
      const maxSpan = 1.1;
      const span =
        Math.floor(Math.random() * (maxSpan - minSpan + 1)) + minSpan;
      console.log(`Span: ${span}`);
      return span;
    };

    const sizedImages: LoadedImage[] = exhibits.map((exhibit) => ({
      id: String(exhibit.id),
      src: exhibit.image_web_url,
      colSpan: randomSpan(),
      rowSpan: randomSpan(),
      title: exhibit.title,
      artist: exhibit.artist_names ?? "Unknown artist",
      isLoaded: false,
      isExiting: false,
    }));

    const hasExisting = imagesRef.current.length > 0;
    if (!hasExisting) {
      setImages(sizedImages);
      return;
    }

    setImages((prev) => prev.map((item) => ({ ...item, isExiting: true })));
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setImages(sizedImages);
    }, FADE_MS);
  }, [exhibits]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleImageLoad = (id: string) => {
    setImages((prev) => {
      let changed = false;
      const next = prev.map((item) => {
        if (item.id !== id || item.isLoaded) {
          return item;
        }
        changed = true;
        return { ...item, isLoaded: true };
      });

      return changed ? next : prev;
    });
  };

  const registerImageRef = (id: string) => (node: HTMLImageElement | null) => {
    if (node && node.complete) {
      handleImageLoad(id);
    }
  };

  return (
    <div className="grid-container">
      {images.length > 0 &&
        images.map((image) => {
          return (
            <div
              onClick={() => {
                navigate(`/exhibit/${image.id}`, {
                  state: {
                    from: `${location.pathname}${location.search}`,
                  },
                });
              }}
              key={image.id}
              className={[
                "exhibit-container",
                image.isLoaded ? "is-loaded" : "",
                image.isExiting ? "is-exiting" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                gridRowEnd: `span ${image.rowSpan}`,
              }}
            >
              <img
                className="exhibit"
                src={image.src}
                loading="lazy"
                decoding="async"
                alt={image.title}
                ref={registerImageRef(image.id)}
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageLoad(image.id)}
              ></img>
              <div className="exhibit-info">
                <h1 className="exhibit-info-title">{image.title}</h1>
                <h2 className="exhibit-info-artist">{image.artist}</h2>
              </div>
            </div>
          );
        })}

      {isLoading && images.length === 0 && <p>Loading</p>}
    </div>
  );
}

export default GalleryContainer;
