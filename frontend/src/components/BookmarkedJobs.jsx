import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../lib/auth";

const NavButton = ({ to, children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = pathname === to;

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`w-full text-left rounded-lg px-3 py-2 border transition
        ${
          active
            ? "text-white border-graphite-700 bg-graphite-900"
            : "text-graphite-300 hover:bg-graphite-900 hover:text-white border-graphite-800"
        }`}
    >
      {children}
    </button>
  );
};

export default function BookmarkedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/bookmarked_jobs");
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
      const res = await apiFetch("/update_bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: jobId, bookmark: false }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.message || "Fehler");
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (e) {
      console.error(e);
      setErr("Konnte Lesezeichen nicht entfernen.");
    }
  };

  if (loading)
    return <div className="text-graphite-300">Lade Lesezeichen…</div>;
  if (err) return <div className="text-red-400">{err}</div>;

  return (
    <div className="mx-auto max-w-[1400px] w-full px-3 md:px-6 lg:px-8 py-4">
      {/* Logo + Titel */}
      <header className="flex items-center gap-2">
        <svg
          className="h-8 w-8"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nc-accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <mask id="nc-crescent">
              <rect width="64" height="64" fill="black" />
              <circle cx="28" cy="28" r="14" fill="white" />
              <circle cx="34" cy="24" r="14" fill="black" />
            </mask>
          </defs>
          <circle
            cx="28"
            cy="28"
            r="14"
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            width="64"
            height="64"
            fill="url(#nc-accent)"
            mask="url(#nc-crescent)"
          />
          <line
            x1="38"
            y1="38"
            x2="46.5"
            y2="46.5"
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h1 className="text-[18px] md:text-[20px] font-semibold tracking-tight bg-gradient-to-r from-[#A5B4FC] to-[#6366F1] bg-clip-text text-transparent">
          Night Crawler
        </h1>
      </header>

      {/* Sidebar + Main */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        <aside className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-3 md:p-4 md:sticky md:top-4 h-fit">
          <nav className="grid gap-2">
            <NavButton to="/">Suche</NavButton>
            <NavButton to="/bookmarked">Lesezeichen</NavButton>
            <NavButton to="/search_alerts">Suchaufträge</NavButton>
          </nav>
        </aside>

        <main className="grid gap-4">
          <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-4 md:p-6">
            <h2 className="text-lg font-medium text-graphite-100 mb-3">
              Lesezeichen
            </h2>

            {jobs.length === 0 ? (
              <p className="text-graphite-400">Keine gebookmarkten Jobs.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {jobs.map((job) => (
                  <li
                    key={job._id}
                    className="w-full rounded-xl border border-graphite-800 bg-graphite-900/60 p-4 hover:bg-graphite-900 transition"
                  >
                    <div className="flex items-start gap-3">
                      {/* Stern links – immer aktiv; Klick entfernt Bookmark */}
                      <button
                        type="button"
                        aria-pressed={true}
                        title="Lesezeichen entfernen"
                        onClick={() => removeBookmark(job._id)}
                        className="shrink-0 rounded-lg p-2 border border-graphite-800 hover:bg-graphite-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-[#6366F1]"
                          aria-hidden="true"
                        >
                          <polygon
                            points="12,17.27 18.18,21 16.54,13.97 22,9.24 14.81,8.63 12,2 9.19,8.63 2,9.24 7.46,13.97 5.82,21"
                            fill="currentColor"
                          />
                        </svg>
                      </button>

                      {/* Text rechts – 3 Zeilen */}
                      <div className="min-w-0">
                        <div className="text-graphite-50 font-medium truncate">
                          {job.title}
                        </div>
                        <div className="text-sm text-graphite-300 mt-0.5">
                          {job.company} ({job.source})
                        </div>
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 mt-1 inline-block"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
