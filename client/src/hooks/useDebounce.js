import { useEffect, useState } from "react";

// Custom hook used to send the debounced value into the server side only after the delay has gone passed, typing restarts the delay
// Mainly used when looking searching by the searchbars found throughout the website

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
