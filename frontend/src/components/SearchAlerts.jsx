import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

function SearchAlerts() {
    const [searchAlerts, setSearchAlerts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3050/search_alerts")
            .then((res) => res.json())
            .then((data) => setSearchAlerts(data))
            .catch((err) => console.error("Fehler beim Abrufen der Suchaufträge:", err));
    }
    , []);

    const handleDeleteAlert = (id) => {
        fetch(`http://localhost:3050/delete_search_alert/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    setSearchAlerts(searchAlerts.filter((alert) => alert._id !== id));
                    alert ("Suchauftrag gelöscht.");
                } else {
                    alert ("Fehler beim Löschen des Suchauftrags.");
                }
            })
            .catch((err) => console.error("Fehler beim Löschen des Suchauftrags:", err));
    };

    const handleViewResults = (alertId) => {
        navigate(`/search_results/${alertId}`);
    };

    return (
        <div className="container">
            <h2>Gespeicherte Suchaufträge</h2>
            <button onClick={() => navigate("/")}>Zurück zur Suche</button>
            {searchAlerts.length === 0 ? (
                <p>Keine Suchaufträge gefunden.</p>
            ) : (
                <div className="alerts-container">
                    {searchAlerts.map((alert) => (
                        <div key={alert._id} className="alert-bubble" onClick={() => handleViewResults(alert._id)}>
                            <p><strong>Keywords:</strong> {alert.keywords.join(", ")}</p>
                            <p><strong>Location:</strong> {alert.location}</p>
                            <p><strong>Radius:</strong> {alert.radius} km</p>
                            <p><strong>Email:</strong> {alert.email}</p>
                            <button onClick={() => handleDeleteAlert(alert._id)}>Löschen</button>
                        </div>
                    ))}
                </div>           
            )}
        </div>
    );
}

export default SearchAlerts;