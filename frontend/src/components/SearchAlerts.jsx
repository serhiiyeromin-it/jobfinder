import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Ein separates Formular für die Übersichtlichkeit
function EditAlertForm({ alert, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    ...alert,
    // Backend speichert Keywords als Array, für das Formular machen wir einen String daraus
    keywords: alert.keywords.join(", "),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wandle den Keyword-String zurück in ein Array für das Backend
    const keywordsArray = formData.keywords.split(",").map((k) => k.trim()).filter(Boolean);
    onUpdate(formData._id, { ...formData, keywords: keywordsArray });
  };

  return (
    <div className="edit-form-container">
      <h3>Suchauftrag bearbeiten</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Keywords (Komma-getrennt):</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Ort:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Radius (in km):</label>
          <input
            type="number"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>E-Mail für Benachrichtigungen:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Abbrechen
          </button>
          <button type="submit" className="btn-save">
            Änderungen speichern
          </button>
        </div>
      </form>
    </div>
  );
}

function SearchAlerts() {
  const [searchAlerts, setSearchAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null); // Speichert das Alert-Objekt, das gerade bearbeitet wird
  const navigate = useNavigate();

  // Funktion zum Laden der Suchaufträge
  const fetchAlerts = () => {
    fetch("http://localhost:3050/search_alerts")
      .then((res) => res.json())
      .then((data) => setSearchAlerts(data))
      .catch((err) => console.error("Fehler beim Abrufen der Suchaufträge:", err));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDeleteAlert = (id) => {
    if (window.confirm("Diesen Suchauftrag wirklich löschen?")) {
      fetch(`http://localhost:3050/delete_search_alert/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            fetchAlerts(); // Liste neu laden, um den gelöschten Eintrag zu entfernen
            alert("Suchauftrag gelöscht.");
          } else {
            alert("Fehler beim Löschen des Suchauftrags.");
          }
        })
        .catch((err) => console.error("Fehler beim Löschen:", err));
    }
  };

  const handleUpdateAlert = (id, updatedData) => {
    fetch(`http://localhost:3050/update_search_alert/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEditingAlert(null); // Formular schließen
          fetchAlerts(); // Liste neu laden, um Änderungen anzuzeigen
          alert("Suchauftrag aktualisiert.");
        } else {
          alert("Fehler beim Aktualisieren.");
        }
      })
      .catch((err) => console.error("Fehler beim Update:", err));
  };

  return (
    <div className="container">
      <h1>Job-Suchauftragsverwaltung</h1>
      <button onClick={() => navigate("/")}>Zurück zur Suche</button>

      {/* Das Bearbeitungsformular wird nur angezeigt, wenn editingAlert gesetzt ist */}
      {editingAlert && (
        <EditAlertForm
          alert={editingAlert}
          onUpdate={handleUpdateAlert}
          onCancel={() => setEditingAlert(null)}
        />
      )}

      <h2>Meine Suchaufträge</h2>
      {searchAlerts.length === 0 ? (
        <p>Keine Suchaufträge gefunden.</p>
      ) : (
        <div className="alerts-list">
          {searchAlerts.map((alert) => (
            <div key={alert._id} className="alert-card">
              <div className="alert-details">
                <p><strong>Keywords:</strong> {alert.keywords.join(", ")}</p>
                <p><strong>Ort:</strong> {alert.location} ({alert.radius} km)</p>
                <p><small>ID: {alert._id}</small></p>
              </div>
              <div className="alert-actions">
                {/* Der Klick auf Bearbeiten setzt den 'editingAlert' State */}
                <button className="btn-edit" onClick={() => setEditingAlert(alert)}>
                  Bearbeiten
                </button>
                <button className="btn-delete" onClick={() => handleDeleteAlert(alert._id)}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAlerts;