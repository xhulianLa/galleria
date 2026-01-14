import "./navbar.css";
import { NavLink, Link } from "react-router";

function NavBar() {
  return (
    <nav>
      <ul className="nav-items">
        <Link id="logo" to="/">
          galleria<span id="logo-dot">.</span>
        </Link>
        <Link id="slideshow-link" to="/">
          START SLIDESHOW
        </Link>
      </ul>
    </nav>
  );
}

export default NavBar;
