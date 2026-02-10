import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [me, setMe] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    return {
      fullName: localStorage.getItem("fullName") || "",
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "",
    };
  });
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

  // keep localStorage synced
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const setSession = (data) => {
    const t = data?.token ?? data?.Token ?? "";
    const role = data?.role ?? data?.Role ?? "";
    const email = data?.email ?? data?.Email ?? "";
    const fullName = (data?.fullName || data?.FullName || data?.name || data?.Name) ?? "";

    localStorage.setItem("token", t);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    localStorage.setItem("fullName", fullName);

    setToken(t);
    setMe({ fullName, email, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    setToken("");
    setMe(null);
  };

  // verify /me when token exists
  useEffect(() => {
    (async () => {
      const t = localStorage.getItem("token");
      if (!t) {
        setLoading(false);
        setMe(null);
        return;
      }

      setLoading(true);
      try {
        const r = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        const nm = {
          fullName: r.data?.fullName ?? r.data?.FullName ?? r.data?.name ?? r.data?.Name ?? "",
          email: r.data?.email ?? r.data?.Email ?? "",
          role: localStorage.getItem("role") || "",
        };

        setMe(nm);

        if (nm.fullName) localStorage.setItem("fullName", nm.fullName);
        if (nm.email) localStorage.setItem("email", nm.email);
      } catch (e) {
        const status = e?.response?.status;
        if (status === 401) logout(); // invalid token
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const value = useMemo(
    () => ({ token, me, loading, isLoggedIn: !!token, setSession, logout }),
    [token, me, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
