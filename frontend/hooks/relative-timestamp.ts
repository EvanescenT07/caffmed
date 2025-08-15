"use client";

import { useMemo } from "react";

export function RelativeTimeStamp(createdAtISO: string, now: Date) {
  return useMemo(() => {
    const date = new Date(createdAtISO);
    const diffMs = Math.abs(now.getTime() - date.getTime());
    if (diffMs <= 5000) return "Just now";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [createdAtISO, now]);
}
