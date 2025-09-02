import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Suchaufträge-Komponente
function SearchAlerts() {
  const [searchAlerts, setSearchAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // API-Endpunkt zum Abrufen der Suchaufträge
    fetch("http://localhost:3050/search_alerts")
      .then((res) => res.json())
      .then((data) => setSearchAlerts(data))
      .catch((err) =>
        console.error("Fehler beim Abrufen der Suchaufträge:", err),
      );
  }, []);

  const handleOpenAlert = (id) => {
    navigate(`/search_alert/${id}`);
  };

  const handleDeleteAlert = async (id, e) => {
    // Verhindert das Auslösen von handleOpenAlert
    if (e) e.stopPropagation();
    try {
      // API-Endpunkt zum Löschen eines Suchauftrags
      const res = await fetch(
        `http://localhost:3050/delete_search_alert/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Löschen fehlgeschlagen");
      setSearchAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Fehler beim Löschen des Suchauftrags:", err);
    }
  };

  return (
    <div className="container">
      <h2>Suchaufträge</h2>
      <button onClick={() => navigate("/")}>Zurück zur Suche</button>
      {searchAlerts.length === 0 ? (
        <p>Keine Suchaufträge gefunden.</p>
      ) : (
        <div className="alerts-container">
          {searchAlerts.map((alert) => (
            <div
              key={alert._id}
              onClick={() => handleOpenAlert(alert._id)}
              className="alert-bubble"
            >
              <p>
                <strong>Keywords:</strong> {alert.keywords.join(", ")}
              </p>
              <p>
                <strong>Location:</strong> {alert.location}
              </p>
              <p>
                <strong>Radius:</strong> {alert.radius} km
              </p>
              <p>
                <strong>Email:</strong> {alert.email}
              </p>
              <button onClick={(e) => handleDeleteAlert(alert._id, e)}>
                Löschen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAlerts;
