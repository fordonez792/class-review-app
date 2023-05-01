import React, { useState, useContext } from "react";

export const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};
