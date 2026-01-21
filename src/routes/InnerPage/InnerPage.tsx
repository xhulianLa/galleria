import NavBar from "../../components/NavBar/navbar";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { useParams } from "react-router-dom";
import ImageCard from "../../components/ImageCard/ImageCard";
import type { Exhibit } from "../../types";
import "./InnerPage.css";

type InnerPageProps = {
  exhibits: Exhibit[];
};

function extractFirstYear(yearString) {
  const match = yearString.match(/\d{4}/);
  return match ? match[0] : null;
}

function extractArtistName(input) {
  // Remove everything in parentheses
  const withoutParens = input.replace(/\s*\(.*?\)\s*/, "");

  // Remove leading first name if present (keeps common museum-style format)
  const parts = withoutParens.trim().split(" ");

  // Heuristic: drop the first name, keep the rest
  return parts.slice(1).join(" ");
}

function InnerPage({ exhibits }: InnerPageProps) {
  const { eid } = useParams();
  const exhibit = exhibits.find(
    (item) => String(item.exhibit_id) === String(eid)
  );

  return (
    <div className="app-wrapper">
      <NavBar />
      <main className="inner-page">
        {!exhibit && (
          <p className="inner-page__status">Loading image details...</p>
        )}
        {exhibit && (
          <section className="inner-page__hero">
            <div className="inner-page-left">
              <ImageCard
                src={exhibit.image_url}
                alt={exhibit.title}
                viewHref={exhibit.image_url}
              />
              <div className="inner-page-title-wrapper">
                <h1 className="inner-page__title">{exhibit.title}</h1>
                <p className="inner-page__artist">
                  {extractArtistName(exhibit.artist)}
                </p>
              </div>
            </div>
            <div className="inner-page__meta">
              {exhibit.date_display && (
                <p className="inner-page__year">
                  {extractFirstYear(exhibit.date_display)}
                </p>
              )}
              {exhibit.description && (
                <p className="inner-page__description">{exhibit.description}</p>
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
      <NavigationBar exhibit={exhibit} />
    </div>
  );
}

export default InnerPage;
