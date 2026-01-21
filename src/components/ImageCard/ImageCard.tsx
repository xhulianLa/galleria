import "./imagecard.css";

type ImageCardProps = {
  src: string;
  alt: string;
  viewHref?: string;
  className?: string;
};

function ImageCard({ src, alt, viewHref, className = "" }: ImageCardProps) {
  const cardClass = ["image-card", className].filter(Boolean).join(" ");

  return (
    <div className={cardClass}>
      <img className="image-card__image" src={src} alt={alt} />
      {viewHref && (
        <a
          className="image-card__button"
          href={viewHref}
          target="_blank"
          rel="noreferrer"
        >
          <span className="image-card__button-icon" aria-hidden="true"></span>
          View Image
        </a>
      )}
    </div>
  );
}

export default ImageCard;
