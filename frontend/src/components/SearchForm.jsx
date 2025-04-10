import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm({ onSearch, jobs, handleBookmarkChange }) {
    const [keywords, setKeywords] = useState([]);
    const [location, setLocation] = useState("");
    const [radius, setRadius] = useState("30");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Boolean für den Ladezustand
    const navigate = useNavigate();

    const handleAddKeyword = () => {
        const keywordInput = document.getElementById("keyword");
        if (keywordInput.value.trim()) {
        setKeywords([...keywords, keywordInput.value.trim()]);
        keywordInput.value = "";
        }
    };

  const handleKeyPress = (e) => {
    const keywordInput = e.target;
    if (e.key === "Enter") {
      e.preventDefault();
      if (keywordInput.value.trim()) {
        setKeywords([...keywords, keywordInput.value.trim()]);
        keywordInput.value = "";
      }
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Ladezustand aktivieren
    onSearch({ keywords, location, radius }).then(() => {
        setIsLoading(false);
    });
  };

  const handleSaveSearch = () => {
    if (!email.trim()) {
      alert("Bitte geben Sie eine E-Mail-Adresse ein, um den Suchauftrag zu speichern.");
      return;
    }

    fetch("http://localhost:3050/save_search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location, radius, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Suchauftrag gespeichert:", data);
      })
      .catch((err) => {
        console.error("Fehler beim Speichern des Suchauftrags:", err);
      });
  };

  return (
    <div className="container">
      <h1>IT ist Zukunft, IT ist alles!</h1>

      <form onSubmit={handleSubmit}>
        <div className="keyword-section">
          <input
            type="text"
            id="keyword"
            placeholder="Neuen Suchbegriff eingeben"
            onKeyPress={handleKeyPress}
          />
          <button type="button" onClick={handleAddKeyword}>
            Suchbegriff hinzufügen
          </button>
        </div>

        <div className="keyword-bubbles">
          {keywords.map((keyword, index) => (
            <span key={index} className="bubble">
              {keyword}
              <button
                className="remove-button"
                onClick={() => handleRemoveKeyword(index)}
              >
                x
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          id="location"
          placeholder="Standort eingeben"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <select
          name="radius"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        >
          <option value="5">5km</option>
          <option value="10">10km</option>
          <option value="20">20km</option>
          <option value="30">30km</option>
          <option value="40">40km</option>
          <option value="50">50km</option>
          <option value="75">75km</option>
          <option value="100">100km</option>
        </select>

        <button type="submit">Jobs finden</button>
        <input type="email" placeholder="Email-Adresse eingeben" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="button" onClick={handleSaveSearch} disabled={!email.trim()}>
          Suchauftrag speichern
        </button>
      </form>

      <div>
        <button type="button" onClick={() => navigate("/bookmarked")}>
          Gespeicherte Lesezeichen
        </button>
        <button type="button" onClick={() => navigate("/search-alerts")}>
          Gespeicherte Suchaufträge
        </button>
      </div>

      {isLoading ? (
        <div className="spinner">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      ) : (
        <div className="results">
          <h2>Gefundene Jobs:</h2>
          {jobs.length === 0 ? (
            <p>Keine Ergebnisse gefunden.</p>
          ) : (
            <ul>
              {jobs.map((job, index) => (
                <li key={index}>
                  <strong>{job.title}</strong> bei {job.company} –{" "}
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    Details
                  </a>
                  <label>
                    <input
                      type="checkbox"
                      checked={job.bookmark}
                      onChange={(e) => handleBookmarkChange(e, job)}
                    />
                    {job.bookmark ? "Entfernen" : "Speichern"}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchForm;