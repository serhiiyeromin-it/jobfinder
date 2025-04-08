import React, { useState, useEffect } from 'react';

function BookmarkManager() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]); // Zustand für gespeicherte Jobs
  const [jobsToDisplay, setJobsToDisplay] = useState([]); // Zustand für die aktuell angezeigten Jobs
  const [allJobs, setAllJobs] = useState([]); // Zustand für alle Jobs

  useEffect(() => {
    // Abrufen der Jobs von der API (MongoDB-Datenquelle)
    fetch('http://localhost:3050/api/jobs') // API-Endpunkt, der die Jobs aus MongoDB liefert
      .then(response => response.json())
      .then(data => {
        setAllJobs(data); // Alle Jobs setzen
        setJobsToDisplay(data); // Initial alle Jobs anzeigen
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Jobs:', error);
      });

    // Beim Laden der Seite gespeicherte Jobs aus localStorage holen
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    setBookmarkedJobs(savedBookmarks);
  }, []);

  // Job speichern oder entfernen
  const handleBookmark = (job) => {
    // Wenn der Job bereits gespeichert ist, entferne ihn
    if (bookmarkedJobs.some((savedJob) => savedJob.link === job.link)) {
      const updatedBookmarks = bookmarkedJobs.filter((savedJob) => savedJob.link !== job.link);
      setBookmarkedJobs(updatedBookmarks);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks)); // Speichern im localStorage
    } else {
      // Wenn der Job noch nicht gespeichert ist, füge ihn hinzu
      const updatedBookmarks = [...bookmarkedJobs, job];
      setBookmarkedJobs(updatedBookmarks);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks)); // Speichern im localStorage
    }
  };

  // // Zeigt nur die gespeicherten Jobs an
  // const handleShowBookmarks = () => {
  //   setJobsToDisplay(bookmarkedJobs); // Nur gespeicherte Jobs anzeigen
  // };

  // // Zeigt alle Jobs an
  // const handleShowAllJobs = () => {
  //   setJobsToDisplay(allJobs); // Alle Jobs anzeigen
  // };

  // Überprüft, ob ein Job bereits gespeichert wurde
  const isBookmarked = (job) => {
    return bookmarkedJobs.some((savedJob) => savedJob.link === job.link);
  };

  return (
    <div className="main-container">
      {/* Anzeige der Jobs */}
      <div className="results">
        <label>
          <input
            type="checkbox"
            checked={isBookmarked(job)}
            onChange={() => handleBookmark(job)}
          />
          {isBookmarked(job) ? ' Entfernen' : ' Job speichern'}
        </label>
      </div>
    </div>
  );
}

export default BookmarkManager;
