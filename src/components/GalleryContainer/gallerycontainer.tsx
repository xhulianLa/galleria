import "./gridcontainer.css";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Exhibit = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

type Exhibit2 = {
  exhibit_id: number;
  title: string;
  date_display: string;
  culture: string;
  type: string;
  technique: string;
  measurements: string;
  tombstone: string;
  description: string;
  artist: string;
  department: string;
  collection: string;
  url: string;
  image_url: string;
};

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
  exhibits?: Exhibit2[];
  appState: { isSearching: boolean };
  setAppState: Dispatch<SetStateAction<{ isSearching: boolean }>>;
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

        const sizedImages = loadedSrcs.map((src, index) => ({
          id: exhibits[index]?.exhibit_id ?? src,
          src,
          colSpan: randomSpan(),
          rowSpan: randomSpan(),
          title: exhibits[index]?.title,
          artist: exhibits[index]?.artist,
          type: exhibits[index]?.type,
          technique: exhibits[index]?.technique,
        }));

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
        images.map((image, index) => {
          return (
            <div
              onClick={() => {
                navigate(`/${image.id}`);
              }}
              key={index}
              className="exhibit-container"
              style={{
                gridRowEnd: `span ${image.rowSpan}`,
                gridColumnEnd: `span ${image.colSpan}`,
              }}
            >
              <img key={image.id} className="exhibit" src={image.src}></img>
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
