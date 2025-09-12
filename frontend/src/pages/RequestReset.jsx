import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:3050";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/auth/request-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg("Wenn die E-Mail existiert, wurde ein Reset-Link gesendet.");
  };
  return (
    <div className="mx-auto max-w-[480px] mt-10 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
      <h1 className="text-xl text-graphite-100 mb-4">Passwort zurücksetzen</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input
          className="rounded-xl bg-graphite-900/60 border border-graphite-800 px-3 py-2 text-graphite-100"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
          Link senden
        </button>
        {msg && <div className="text-sm text-graphite-300">{msg}</div>}
      </form>
    </div>
  );
}
