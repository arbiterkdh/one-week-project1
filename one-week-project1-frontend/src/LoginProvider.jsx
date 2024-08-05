import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [expired, setExpired] = useState(0);
  const [nickname, setNickname] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");
  const [authority, setAuthority] = useState([]);

  const toast = useToast();

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, [timer]);

  useEffect(() => {
    if (timer % 5 === 4) {
      setTimer(0);
    }
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
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
    const exp = payload.exp;
    if (Date.now() >= exp * 1000) {
      logout();
      toast({
        status: "info",
        description: "토큰이 만료되어 로그아웃되었습니다.",
        position: "bottom-left",
      });
    } else {
      setExpired(exp);
      setId(payload.sub);
      setNickname(payload.nickname);
      setPicture(payload.picture);
      setEmail(payload.email);
      setAuthority(payload.scope.split(" "));
    }
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
