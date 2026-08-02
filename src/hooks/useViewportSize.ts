import { useEffect, useState } from "react";

function calc() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useViewportSize() {
  const [size, setSize] = useState(calc);

  useEffect(() => {
    const onChange = () => setSize(calc());
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  return size;
}
