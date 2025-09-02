// frontend/src/components/BookmarkedJobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3050";

export default function BookmarkedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bookmarked_jobs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Fehler beim Laden der Lesezeichen.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeBookmark = async (jobId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update_bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: jobId, bookmark: false }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Fehler");
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (e) {
      console.error(e);
      setErr("Konnte Lesezeichen nicht entfernen.");
    }
  };

  if (loading) return <div>Lade Lesezeichen…</div>;
  if (err) return <div>{err}</div>;

  return (
    <div className="container">
      <h2>Lesezeichen</h2>
      <button onClick={() => navigate(-1)}>Zurück zur Suche</button>
      {jobs.length === 0 ? (
        <p>Keine gebookmarkten Jobs.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <strong>{job.title}</strong> bei {job.company} ({job.source}) –{" "}
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                Details
              </a>{" "}
              <button
                onClick={() => removeBookmark(job._id)}
                title="Lesezeichen entfernen"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
