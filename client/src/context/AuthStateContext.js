import React, { useState, useEffect, useContext } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

import { auth } from "../Firebase";

export const AuthStateContext = React.createContext();

// Provides the logged in information, and persists the login from the user if the user is real user

export const AuthStateProvider = ({ children }) => {
  // Main state to know if a user is logged in or not, or if he is admin or not
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    loggedIn: null,
    admin: null,
  });

  useEffect(() => {
    // Check if user is logged in by a local account
    axios
      .get(`${process.env.REACT_APP_URL}users/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "FAILED") {
          // If not logged in by local account, then check if its google
          onAuthStateChanged(auth, (res) => {
            // If not google then, user is not logged int
            if (!res) {
              localStorage.removeItem("accessToken");
              setAuthState({
                username: "",
                id: 0,
                loggedIn: false,
                admin: false,
              });
              return;
            }
            setAuthState({
              username: res.displayName,
              id: res.uid,
              loggedIn: true,
              admin: false,
            });
            res
              .getIdToken()
              .then((accessToken) => {
                localStorage.setItem("accessToken", accessToken);
              })
              .catch((error) => console.log(error));
          });
        } else {
          if (res.data.username === "admin" && res.data.id === 1) {
            // user is admin and has access to admin panel page
            setAuthState({
              username: res.data.username,
              id: res.data.id,
              loggedIn: true,
              admin: true,
            });
          } else {
            // User is logged in by local account
            setAuthState({
              username: res.data.username,
              id: res.data.id,
              loggedIn: true,
              admin: false,
            });
          }
        }
      });
  }, []);

  const provider = new GoogleAuthProvider();

  // Google sign in popup appears
  const googleSignIn = () => {
    return signInWithPopup(auth, provider);
  };

  // Handles both google and local account log out
  const logOut = () => {
    signOut(auth)
      .then(() => {
        setAuthState({
          username: "",
          id: 0,
          loggedIn: false,
        });
        localStorage.removeItem("accessToken");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <AuthStateContext.Provider
      value={{
        authState,
        setAuthState,
        googleSignIn,
        logOut,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => {
  return useContext(AuthStateContext);
};
