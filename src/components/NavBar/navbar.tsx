import "./navbar.css";
import { Link } from "react-router-dom";

type NavBarProps = {
  firstExhibitId?: number | string;
};

function NavBar({ firstExhibitId }: NavBarProps) {
  const slideshowTarget = firstExhibitId
    ? `/exhibit/${firstExhibitId}`
    : "/";

  return (
    <nav>
      <ul className="nav-items">
        <Link id="logo" to="/">
          galleria<span id="logo-dot">.</span>
        </Link>
        <Link id="slideshow-link" to={slideshowTarget}>
          START SLIDESHOW
        </Link>
      </ul>
    </nav>
  );
}

export default NavBar;
