import React, { Ref, useEffect, useRef, useState } from "react";

export default function useDelayInput(
  onTick: () => void,
  delay: number,
  state: React.Dispatch<any>[]
) {
  const [lastDelayTimeout, setLastDelayTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (lastDelayTimeout === undefined) {
      clearTimeout(lastDelayTimeout);
    }

    let timeout = setTimeout(() => {
      onTick();
    }, delay);
    setLastDelayTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [...state]);
}
