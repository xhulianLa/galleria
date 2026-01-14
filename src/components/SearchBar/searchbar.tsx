import { useState, useRef, useEffect } from "react";
import "./searchbar.css";

export default function SearchBar({updateExhibits, appState, setAppState}) {
  const [inputData, setInputData] = useState("");
  const isSearching = appState.isSearching;

  const search = () => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "foo",
        body: inputData,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setAppState({isSearching: true});
    e.preventDefault();
    search2();
  };

  function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

  const search2 = () => {
    const page = getRandomInt(20)
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`)
      .then((response) => response.json())
      .then((json) => updateExhibits(json))
      .catch((err) => {console.log(err)});
  };

  useEffect(() => {
    console.log(`Is searching: ${isSearching}`)
    console.log("Searchbar effect started")
  }, [isSearching])


  return (
    <form className="searchbar-container" onSubmit={handleSubmit} method="post" tabIndex={1}>
      <div className="searchbar-container-wrapper">
            <input
            disabled={isSearching}
            className="searchbar-input"
            onChange={(e) => setInputData(e.target.value)}
            name="query"
            />
            <button disabled={isSearching} className="searchbar-button" type="submit">
            Search
            </button>
        </div>
    </form>
  );
}
