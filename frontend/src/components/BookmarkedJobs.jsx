import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BookmarkedJobs({ handleBookmarkChange }) {
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const navigate = useNavigate(); // Ermöglicht das Navigieren zurück zur Suchmaske

    useEffect(() => {
        fetch("http://localhost:3050/bookmarked_jobs") // Backend-Route für gebookmarkte Jobs
        .then((res) => res.json())
        .then((data) => setBookmarkedJobs(data))
        .catch((err) => console.error("Fehler beim Abrufen der gespeicherten Jobs:", err));
    }, []);

  return (
    <div className="container">
      <h2>Gespeicherte Lesezeichen</h2>
      <button onClick={() => navigate("/")}>Zurück zur Suche</button> {/* Button für Rückkehr */}
      {bookmarkedJobs.length === 0 ? (
        <p>Keine gespeicherten Jobs gefunden.</p>
      ) : (
        <ul>
            {bookmarkedJobs.map((job) => (
                <li key={job._id}>
                    <strong>{job.title}</strong> bei {job.company} –{" "}
                    <a href={job.link} target="_blank" rel="noopener noreferrer">
                      Details
                    </a>
                    <label>
                      <input
                        type="checkbox"
                        checked={job.bookmark}
                        onChange={() => handleBookmarkChange(job)}
                      />
                      {job.bookmark ? "Entfernen" : "Speichern"}
                    </label>
                </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarkedJobs;