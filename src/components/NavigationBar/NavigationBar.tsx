import "../../components/NavigationBar/NavigationBar.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Exhibit } from "../../types";

const buttonIcon = "/assets/icon-back-button.svg";

type NavigationBarProps = {
  exhibit?: Exhibit;
  exhibits: Exhibit[];
};

function NavigationBar({ exhibit, exhibits }: NavigationBarProps) {
  const navigate = useNavigate();
  const currentIndex = exhibit
    ? exhibits.findIndex((item) => item.id === exhibit.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < exhibits.length - 1;
  const progress = ((currentIndex + 1) / exhibits.length) * 100;
  console.log(exhibits.length);
  console.log(currentIndex);
  console.log(progress);

  const goPrev = () => {
    if (!hasPrev) return;
    const prev = exhibits[currentIndex - 1];
    navigate(`/exhibit/${prev.id}`);
  };

  const goNext = () => {
    if (!hasNext) return;
    const next = exhibits[currentIndex + 1];
    navigate(`/exhibit/${next.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, hasPrev, hasNext]);

  return (
    <div className="navigation-bar-container">
      <div className="navigation-bar">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="navigation-wrapper">
          <div className="navigation-title-wrapper">
            <h2>{exhibit ? exhibit.title : ""}</h2>
            <p>{exhibit ? exhibit.artist_names : ""}</p>
          </div>
          <div className="navigation-buttons">
            <button
              className="back"
              type="button"
              onClick={goPrev}
              disabled={!hasPrev}
            >
              <img src={buttonIcon} alt="" aria-hidden="true"></img>
            </button>
            <button
              className="next"
              type="button"
              onClick={goNext}
              disabled={!hasNext}
            >
              <img src={buttonIcon} alt="" aria-hidden="true"></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
