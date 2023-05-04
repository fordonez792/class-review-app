import React, { useState, useContext } from "react";

export const SearchContext = React.createContext();

// Allows for the search page to be opened in various ways, not just by the search page, but also using the home page searchbar to open it

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
