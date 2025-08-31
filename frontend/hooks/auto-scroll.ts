"use client";

import { useCallback } from "react";

export function AutoScroll(listEndRef: React.RefObject<HTMLElement | null>) {
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listEndRef.current) {
        listEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    });
  }, [listEndRef]);

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      if (listEndRef.current && listEndRef.current.parentElement) {
        listEndRef.current.parentElement.scrollTop = 0;
      }
    });
  }, [listEndRef]);

  return { scrollToBottom, scrollToTop };
}
