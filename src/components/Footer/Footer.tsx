import { useNavigate } from "react-router-dom";
import "./Footer.css";

type FooterProps = {
  page: number;
};

function Footer({ page }: FooterProps) {
  const navigate = useNavigate();
  const hasPrev = page > 1;

  const goPrev = () => {
    if (!hasPrev) return;
    const prevPage = page - 1;
    navigate(prevPage === 1 ? "/" : `/page/${prevPage}`);
  };

  const goNext = () => {
    const nextPage = page + 1;
    navigate(`/page/${nextPage}`);
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__page">Page {page}</span>
        <div className="footer__nav">
          <button
            className="footer__button"
            type="button"
            onClick={goPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button className="footer__button" type="button" onClick={goNext}>
            Next
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
