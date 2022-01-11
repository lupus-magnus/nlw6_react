import React, { createContext, useState } from "react";
import { firebase, auth } from "../services/firebase";

type UserProps = {
  displayName: string;
  photoURL: string;
  id: string;
};
type AuthContextProps = {
  user: UserProps | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
  signInWithGoogle: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextProps);

const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProps>();

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const loginResponse = await auth.signInWithPopup(provider);
    if (loginResponse.user) {
      const { displayName, photoURL, uid } = loginResponse.user;
      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account!");
      }
      setUser({
        id: uid,
        photoURL,
        displayName,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
