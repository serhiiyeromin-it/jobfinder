import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookmarkedJobs from "./components/BookmarkedJobs";
import SearchForm from "./components/SearchForm";
import SearchAlerts from "./components/SearchAlerts";
import SearchResults from "./components/SearchResults";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import { apiFetch } from "./lib/auth";

function App() {
  const [jobs, setJobs] = useState([]); // Array zum Speichern der gefundenen Jobs

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/jobsuchen");
      if (res.ok) setJobs(await res.json());
    })();
  }, []);

  const handleSearch = ({ keywords, location, radius }) =>
    apiFetch("/jobsuchen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location, radius }),
    }).then(async (res) => {
      if (res.ok) setJobs(await res.json());
    });

  const handleBookmarkChange = async (e, job) => {
    const updatedBookmarkStatus = e.target.checked;

    // UI sofort aktualisieren
    setJobs((prev) =>
      prev.map((j) =>
        j._id === job._id ? { ...j, bookmark: updatedBookmarkStatus } : j,
      ),
    );

    // Server-Update (JWT via apiFetch)
    const res = await apiFetch("/update_bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: job._id, bookmark: updatedBookmarkStatus }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error(
        "Fehler beim Aktualisieren des Lesezeichens:",
        data?.message || res.status,
      );
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-graphite-950 text-graphite-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/request-reset" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SearchForm
                    onSearch={handleSearch}
                    jobs={jobs}
                    handleBookmarkChange={handleBookmarkChange}
                    onResetUI={() => setJobs([])}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarked"
              element={
                <ProtectedRoute>
                  <BookmarkedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search_alerts"
              element={
                <ProtectedRoute>
                  <SearchAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search_alert/:alertId"
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
