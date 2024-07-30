import { createContext, useState } from "react";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [expired, setExpired] = useState(0);
  const [nickname, setNickname] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");
  const [authority, setAuthority] = useState([]);

  return (
    <LoginContext.Provider
      value={{
        id,
        nickname,
        picture,
        email,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
