import { useState } from "react";

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState<string>(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  const saveValue = (newValue: string): void => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, saveValue] as const;
}
