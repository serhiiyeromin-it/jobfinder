// frontend/src/components/BookmarkedJobs.jsx
import React, { useState, useEffect } from 'react';

function BookmarkedJobs() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]); // Zustand für gebookmarkte Jobs
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand
  const [message, setMessage] = useState(''); // Zustand für Benutzer-Nachrichten
  const [messageType, setMessageType] = useState(''); // Typ der Nachricht (success/error)

  const API_BASE_URL = 'http://127.0.0.1:3050'; // Basis-URL deines Flask-Backends

  // Funktion zum Anzeigen von Nachrichten
  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000); // Nachricht nach 5 Sekunden ausblenden
  };

  // Effekt, um gebookmarkte Jobs beim Laden der Komponente abzurufen
  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookmarked_jobs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookmarkedJobs(data);
      } catch (e) {
        console.error("Fehler beim Abrufen der gebookmarkten Jobs:", e);
        setError("Fehler beim Laden der gebookmarkten Jobs. Bitte versuchen Sie es später erneut.");
        showMessage("Fehler beim Laden der gebookmarkten Jobs. Bitte versuchen Sie es später erneut.", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedJobs();
  }, []);

  // Funktion zum Entfernen eines Lesezeichens
  const handleRemoveBookmark = async (jobId) => {
    if (!window.confirm('Möchten Sie dieses Lesezeichen wirklich entfernen?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update_bookmark`, {
        method: 'POST', // Der Endpunkt `/update_bookmark` ist ein POST-Endpunkt
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, bookmark: false }), // Setze bookmark auf false zum Entfernen
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        showMessage(data.message, 'success');
        // Aktualisiere den Frontend-Zustand, um den Job zu entfernen
        setBookmarkedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      } else {
        throw new Error(data.message || `Serverfehler: ${response.status}`);
      }
    } catch (e) {
      console.error("Fehler beim Entfernen des Lesezeichens:", e);
      showMessage(`Fehler beim Entfernen des Lesezeichens: ${e.message}`, 'error');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-inter antialiased flex items-center justify-center">
        <p className="text-xl text-gray-700">Lade gebookmarkte Jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-inter antialiased flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Gespeicherte Lesezeichen
        </h1>

        {/* Nachrichtenbereich */}
        {message && (
          <div className={`p-4 mb-6 rounded-lg text-white ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}

        {bookmarkedJobs.length === 0 ? (
          <p className="text-center text-gray-600">Noch keine Jobs gebookmarkt.</p>
        ) : (
          <div className="space-y-4">
            {bookmarkedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <p className="text-lg font-semibold text-gray-800">{job.title}</p>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Details ansehen
                  </a>
                </div>
                <div className="flex space-x-3 mt-2 md:mt-0">
                  <button
                    onClick={() => handleRemoveBookmark(job._id)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200"
                  >
                    Lesezeichen entfernen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarkedJobs;
