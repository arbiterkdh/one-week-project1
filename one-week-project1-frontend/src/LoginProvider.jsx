import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [expired, setExpired] = useState(0);
  const [nickname, setNickname] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");
  const [authority, setAuthority] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, []);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function hasAccess(param) {
    return id == param;
  }

  function isAdmin() {
    return authority.includes("ADMIN");
  }

  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickname(payload.nickname);
    setPicture(payload.picture);
    setEmail(payload.email);
    setAuthority(payload.scope.split(" "));
  }

  function logout() {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
    setId("");
    setExpired(0);
    setNickname("");
    setPicture("");
    setEmail("");
    setAuthority([]);
  }

  return (
    <LoginContext.Provider
      value={{
        id,
        nickname,
        picture,
        email,
        login,
        logout,
        hasAccess,
        isAdmin,
        isLoggedIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
