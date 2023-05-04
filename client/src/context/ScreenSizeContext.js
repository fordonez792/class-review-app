import React, { useState, useEffect, useContext } from "react";

export const ScreenSizeContext = React.createContext();

// Controls and check what screen type is the user using, allows for different stuff to be rendered on different screen sizes
// Both isTable and isDesktop variables used throughout all files

export const ScreenSizeProvider = ({ children }) => {
  const [isTablet, setIsTablet] = useState(window.innerWidth > 767);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1199);

  // Everytime the screen is resized check to see what the screen is
  const updateState = () => {
    setIsTablet(window.innerWidth > 767);
    setIsDesktop(window.innerWidth > 1199);
  };

  useEffect(() => {
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  });

  return (
    <ScreenSizeContext.Provider
      value={{
        isTablet,
        isDesktop,
      }}
    >
      {children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenSizeContext = () => {
  return useContext(ScreenSizeContext);
};
