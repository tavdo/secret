import { useEffect, useState } from 'react';

/** Simulates live counts — swap for WebSocket/API. */
export function useLivePulse(base, jitterRatio = 0.12) {
  const [n, setN] = useState(base);
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- resync jitter origin when upstream count changes */
    setN(base);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [base]);
  useEffect(() => {
    const id = window.setInterval(() => {
      setN(() => {
        const max = Math.floor(base * (1 + jitterRatio));
        const min = Math.floor(base * (1 - jitterRatio));
        const jitter = Math.floor(Math.random() * (max - min)) + min;
        return jitter;
      });
    }, 4200 + Math.random() * 2200);
    return () => window.clearInterval(id);
  }, [base, jitterRatio]);
  return n;
}
