import { useEffect, useState } from "react";
import "./imagecard.css";

type ImageCardProps = {
  src: string;
  alt: string;
  viewSrc?: string;
  className?: string;
};

function ImageCard({ src, alt, viewSrc, className = "" }: ImageCardProps) {
  const cardClass = ["image-card", className].filter(Boolean).join(" ");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cardClass}>
      <img className="image-card__image" src={src} alt={alt} />
      {viewSrc && (
        <button
          className="image-card__button"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <span className="image-card__button-icon" aria-hidden="true"></span>
          View Image
        </button>
      )}
      {viewSrc && isOpen && (
        <div
          className="image-card__overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Full size image"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="image-card__overlay-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-card__overlay-close"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <img className="image-card__overlay-image" src={viewSrc} alt={alt} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCard;
