import "../../components/NavigationBar/NavigationBar.css";

function NavigationBar({ exhibit }) {
  console.log(exhibit);
  return (
    <div className="navigation-bar-container">
      <div className="navigation-bar">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <div className="navigation-wrapper">
          <div className="navigation-title-wrapper">
            <h2>{exhibit ? exhibit.title : ""}</h2>
            <p>{exhibit ? exhibit.artist : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
