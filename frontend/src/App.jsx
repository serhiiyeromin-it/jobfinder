import { useState, useEffect } from 'react'
import './App.css'



function App() {
  const [keywords, setKeywords] = useState([]); // Array zum Speichern der Suchbegriffe
  const [location, setLocation] = useState(""); // String für den Standort
  const [radius, setRadius] = useState("30"); // String für den Radius
  const [jobs, setJobs] = useState([]); // Array zum Speichern der gefundenen Jobs
  const [isLoading, setIsLoading] = useState(false); // Boolean für den Ladezustand

  useEffect(() => { // Initiale Jobs abrufen
    fetch("http://localhost:3050/jobsuchen")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Fehler beim Abrufen der Jobs:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("http://localhost:3050/jobsuchen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location, radius })
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Jobs:", err);
        setIsLoading(false);
      });
  };

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

  const handleBookmarkChange = async (e, job) => {
    const updatedBookmarkStatus = e.target.checked;
    const updatedJobs = jobs.map((j) => 
      j.link === job.link ? { ...j, bookmark: updatedBookmarkStatus } : j
    );
    setJobs(updatedJobs);
    try {
      const response = await fetch("http://localhost:3050/update_bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: job._id, bookmark: updatedBookmarkStatus })
      });
      
      const data = await response.json();

      if (!data.success) {
        console.error("Fehler beim Aktualisieren des Lesezeichens:", data.message);
      }
    } catch (error) {
      console.error("Fehler beim Senden des Lesezeichen-Updates:", error);
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
            onKeyPress={handleKeyPress}
            />
            <button type="button" onClick={handleAddKeyword}>
              Suchbegriff hinzufügen
            </button>
        </div>

        <div className="keyword-bubbles">
          {keywords.map((keyword, index) => (
            <span key={index} className='bubble'>
              {keyword}
              <button className='remove-button' onClick={() => handleRemoveKeyword(index)}>x</button>
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
      </form>
    
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
                <li key={index}><strong>{job.title}</strong> bei {job.company} – <a href={job.link} target="_blank" rel="noopener noreferrer">Details</a>
                <label>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleBookmarkChange(e, job)} 
                  />
                  {job.bookmark ? "Entfernen" : "Job speichern"}
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

export default App;