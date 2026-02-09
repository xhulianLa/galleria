import "./navbar.css";
import { Link } from "react-router-dom";

type NavBarProps = {
  firstExhibitId?: number | string;
  returnTo?: string;
};

function NavBar({ firstExhibitId, returnTo }: NavBarProps) {
  const slideshowTarget = firstExhibitId ? `/exhibit/${firstExhibitId}` : "/";
  const linkTarget = returnTo ?? slideshowTarget;
  const linkLabel = returnTo ? "RETURN TO GALLERY" : "START SLIDESHOW";

  return (
    <nav>
      <ul className="nav-items">
        <Link id="logo" to="/">
          galleria<span id="logo-dot">.</span>
        </Link>
        <Link id="slideshow-link" to={linkTarget}>
          {linkLabel}
        </Link>
      </ul>
    </nav>
  );
}

export default NavBar;
