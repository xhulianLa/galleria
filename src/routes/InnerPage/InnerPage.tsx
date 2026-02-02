import NavBar from "../../components/NavBar/navbar";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCard from "../../components/ImageCard/ImageCard";
import type { Exhibit } from "../../types";
import "./InnerPage.css";

type InnerPageProps = {
  exhibits: Exhibit[];
};

/* function extractFirstYear(yearString?: string) {
  if (!yearString) return null;
  const match = yearString.match(/\d{4}/);
  return match ? match[0] : null;
} */

function extractArtistName(input?: string) {
  if (!input) return "Unknown artist";
  return input.replace(/\s*\(.*?\)\s*/, "").trim();
}

function stripEmTags(input?: string) {
  if (!input) return "";
  return input.replace(/<\/?em>/g, "");
}

function InnerPage({ exhibits }: InnerPageProps) {
  const { eid } = useParams();
  const exhibitFromList = useMemo(() => {
    return exhibits.find((item) => String(item.id) === String(eid));
  }, [eid, exhibits]);
  const [fallbackExhibit, setFallbackExhibit] = useState<Exhibit | null>(null);
  const exhibit = exhibitFromList ?? fallbackExhibit;
  const description = stripEmTags(exhibit?.description);

  useEffect(() => {
    if (!eid) {
      setFallbackExhibit(null);
      return;
    }

    if (exhibitFromList) {
      setFallbackExhibit(null);
      return;
    }

    let cancelled = false;
    setFallbackExhibit(null);

    fetch(`/api/exhibits?exhibit_id=${eid}`)
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        const result = json?.items?.[0] ?? null;
        setFallbackExhibit(result);
      })
      .catch((error) => {
        if (cancelled) return;
        console.log(error);
      });

    return () => {
      cancelled = true;
    };
  }, [eid, exhibitFromList]);

  return (
    <div className="app-wrapper inner-page-shell">
      <NavBar firstExhibitId={exhibits[0]?.id ?? exhibit?.id} />
      <main className="inner-page">
        {!exhibit && (
          <p className="inner-page__status">Loading image details...</p>
        )}
        {exhibit && (
          <section className="inner-page__hero">
            <div className="inner-page-left">
              <ImageCard
                src={exhibit.image_web_url}
                alt={exhibit.title}
                viewSrc={exhibit.image_web_url}
              />
              <div className="inner-page-title-wrapper">
                <h1 className="inner-page__title">{exhibit.title}</h1>
                <p className="inner-page__artist">
                  {extractArtistName(exhibit.artist_names)}
                </p>
              </div>
            </div>
            <div className="inner-page__meta">
              {exhibit.creation_date_display && (
                <p className="inner-page__year">
                  {exhibit.creation_year_earliest}
                </p>
              )}
              {description && (
                <p className="inner-page__description">{description}</p>
              )}
              <a
                className="inner-page__source"
                href={exhibit.url}
                target="_blank"
                rel="noreferrer"
              >
                Go to source
              </a>
            </div>
          </section>
        )}
      </main>
      <NavigationBar exhibit={exhibit ?? undefined} exhibits={exhibits} />
    </div>
  );
}

export default InnerPage;
