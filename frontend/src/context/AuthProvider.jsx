import React, { createContext, useContext, useMemo, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  setTokens,
  clearTokens,
} from "../lib/auth";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [email, setEmail] = useState(localStorage.getItem("auth_email") || "");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));

  const value = useMemo(
    () => ({
      email,
      loggedIn,
      async login(e, p) {
        const { ok, data } = await apiLogin(e, p);
        if (!ok) return { error: data?.error || "Login fehlgeschlagen" };
        setTokens({ access: data.access, refresh: data.refresh });
        localStorage.setItem("auth_email", e);
        setEmail(e);
        setLoggedIn(true);
        return { ok: true };
      },
      async register(e, p) {
        const { ok, data } = await apiRegister(e, p);
        if (!ok)
          return { error: data?.error || "Registrierung fehlgeschlagen" };
        localStorage.setItem("auth_email", e);
        setEmail(e);
        return { ok: true };
      },
      logout() {
        clearTokens();
        localStorage.removeItem("auth_email");
        setLoggedIn(false);
        setEmail("");
      },
    }),
    [email, loggedIn],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
