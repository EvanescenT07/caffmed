"use client";

import { useCallback } from "react";

export function AutoScroll(listEndRef: React.RefObject<HTMLElement | null>) {
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listEndRef.current) {
        listEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    });
  }, [listEndRef]);

  return { scrollToBottom };
}
