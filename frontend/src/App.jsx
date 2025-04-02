
import { useState } from 'react'
import './App.css'

function App() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("alle bundeslaender");
  const [ort, setOrt] = useState("egal");
  const [jobs, setJobs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // verhindert Seitenreload

    // Für späteren Backend-POST
    fetch("http://localhost:3050/jobsuchen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, region, ort })
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data); // Ergebnisse anzeigen
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Jobs:", err);
      });
  };

  return (
    <div className="container">
      <h1>IT ist Zukunft, IT ist alles!</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="keyword"
          name="keyword"
          placeholder="Dein Lieblingsberuf"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
        />

        <select
          name="region"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="alle bundeslaender">Alle Bundesländer</option>
          <option value="baden-wuerttemberg">Baden-Württemberg</option>
          <option value="bayern">Bayern</option>
          <option value="berlin">Berlin</option>
          <option value="brandenburg">Brandenburg</option>
          <option value="bremen">Bremen</option>
          <option value="hamburg">Hamburg</option>
          <option value="hessen">Hessen</option>
          <option value="mecklenburg-vorpommern">Mecklenburg-Vorpommern</option>
          <option value="niedersachsen">Niedersachsen</option>
          <option value="nordrhein-westfalen">Nordrhein-Westfalen</option>
          <option value="rheinland-pfalz">Rheinland-Pfalz</option>
          <option value="saarland">Saarland</option>
          <option value="sachsen">Sachsen</option>
          <option value="sachsen-anhalt">Sachsen-Anhalt</option>
          <option value="schleswig-holstein">Schleswig-Holstein</option>
          <option value="thueringen">Thüringen</option>
          <option value="malle">Mallorca</option>
        </select>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="ort"
              value="Buero"
              checked={ort === "Buero"}
              onChange={(e) => setOrt(e.target.value)}
            /> Büro
          </label>
          <label>
            <input
              type="radio"
              name="ort"
              value="Remote"
              checked={ort === "Remote"}
              onChange={(e) => setOrt(e.target.value)}
            /> Remote
          </label>
          <label>
            <input
              type="radio"
              name="ort"
              value="Hybrid"
              checked={ort === "Hybrid"}
              onChange={(e) => setOrt(e.target.value)}
            /> Hybrid
          </label>
          <label>
            <input
              type="radio"
              name="ort"
              value="egal"
              checked={ort === "egal"}
              onChange={(e) => setOrt(e.target.value)}
            /> Mir Wurscht
          </label>
        </div>

        <button type="submit">Jobs finden</button>
      </form>

      <div className="results">
        <h2>Gefundene Jobs:</h2>
        {jobs.length === 0 ? (
          <p>Keine Ergebnisse gefunden.</p>
        ) : (
          <ul>
            {jobs.map((job, index) => (
              <li key={index}>{job.title} – {job.location}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
