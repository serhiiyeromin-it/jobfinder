
import { useState } from 'react'
import './App.css'

function App() {
  const [keywords, setKeywords] = useState([]);
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("30");
  const [jobs, setJobs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // verhindert Seitenreload

    // Für späteren Backend-POST
    fetch("http://localhost:3050/jobsuchen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location, radius })
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data); // Ergebnisse anzeigen
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Jobs:", err);
      });
  };

  const handleAddKeyword = () => {
    const keywordInput = document.getElementById("keyword");
    if (keywordInput.value.trim()) {
      setKeywords([...keywords, keywordInput.value.trim()]);
      keywordInput.value = ""; // Eingabefeld leeren
    }
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
            />
            <button type="button" onClick={handleAddKeyword}>
              Suchbegriff hinzufügen
            </button>
            <ul>
              {keywords.map((kw, index) => (
                <li key={index}>{kw}</li>
              ))}
            </ul>
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
      </form>

      <div className="results">
        <h2>Gefundene Jobs:</h2>
        {jobs.length === 0 ? (
          <p>Keine Ergebnisse gefunden.</p>
        ) : (
          <ul>
            {jobs.map((job, index) => (
              <li key={index}>{job.title} - {job.location}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
