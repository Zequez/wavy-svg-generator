import { useState } from "./external.js";

const localStoragePrefix = "wavy_svg_";

export function usePersistentState(
  key,
  initialValue,
  encoder = (v) => v,
  decoder = (v) => v
) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(`${localStoragePrefix}${key}`);
    return item
      ? decoder(JSON.parse(item))
      : typeof initialValue === "function"
      ? initialValue()
      : initialValue;
  });
  return [
    storedValue,
    (val) => {
      localStorage.setItem(
        `${localStoragePrefix}${key}`,
        JSON.stringify(encoder(val))
      );
      setStoredValue(val);
    },
  ];
}
