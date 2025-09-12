import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:3050";

export default function VerifyEmail() {
  const [state, setState] = useState("checking");
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return setState("fail");
    (async () => {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setState(res.ok ? "ok" : "fail");
    })();
  }, []);
  return (
    <div className="mx-auto max-w-[480px] mt-10 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6 text-center">
      {state === "checking" && (
        <div className="text-graphite-300">Prüfe Bestätigung…</div>
      )}
      {state === "ok" && (
        <div className="text-green-400">
          E-Mail verifiziert!{" "}
          <a className="text-indigo-400 hover:text-indigo-300" href="/login">
            Zum Login
          </a>
        </div>
      )}
      {state === "fail" && (
        <div className="text-red-400">Link ungültig oder abgelaufen.</div>
      )}
    </div>
  );
}
