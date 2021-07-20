import { useState, useEffect } from 'react';

export function useSeconds() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setValue(value + 1);
    }, 1000);
  }, [value]);

  return { value, setValue };
}

export default useSeconds;
