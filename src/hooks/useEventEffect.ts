import { useCallback, useInsertionEffect, useRef } from "react";

//needed to allow for adding event listeners that use state
//to openlayers - hopefully it will become official soon
//as it is currently experimental in React
export default function useEventEffect(fn: any) {
  const ref = useRef(null);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: any[]) => {
    const f = ref.current as any;
    return f(...args);
  }, []);
}