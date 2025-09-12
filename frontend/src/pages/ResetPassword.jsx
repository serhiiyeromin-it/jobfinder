import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:3050";

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: pw }),
    });
    setMsg(
      res.ok
        ? "Passwort gesetzt. Bitte einloggen."
        : "Link ungültig/abgelaufen.",
    );
  };
  return (
    <div className="mx-auto max-w-[480px] mt-10 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
      <h1 className="text-xl text-graphite-100 mb-4">Neues Passwort</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input
          className="rounded-xl bg-graphite-900/60 border border-graphite-800 px-3 py-2 text-graphite-100"
          type="password"
          placeholder="Neues Passwort"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="w-full h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
          Speichern
        </button>
        {msg && <div className="text-sm text-graphite-300">{msg}</div>}
      </form>
    </div>
  );
}
