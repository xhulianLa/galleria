import { useNavigate } from "react-router-dom";
import "./Footer.css";

type FooterProps = {
  page: number;
};

function Footer({ page }: FooterProps) {
  const navigate = useNavigate();
  const hasPrev = page > 1;
  const pagesToShow = 5;
  const halfWindow = Math.floor(pagesToShow / 2);
  const startPage =
    page <= halfWindow + 1 ? 1 : Math.max(1, page - halfWindow);
  const pages = Array.from({ length: pagesToShow }, (_, index) => {
    return startPage + index;
  });

  const goPrev = () => {
    if (!hasPrev) return;
    const prevPage = page - 1;
    navigate(prevPage === 1 ? "/" : `/page/${prevPage}`);
  };

  const goNext = () => {
    const nextPage = page + 1;
    navigate(`/page/${nextPage}`);
  };

  const goPage = (targetPage: number) => {
    if (targetPage === page) return;
    navigate(targetPage === 1 ? "/" : `/page/${targetPage}`);
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__page">Page {page}</span>
        <div className="footer__pages" aria-label="Pagination">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              className={[
                "footer__page-button",
                pageNumber === page ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              onClick={() => goPage(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
        </div>
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
