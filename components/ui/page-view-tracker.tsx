"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === last.current) return;
    last.current = pathname;
    // sendBeacon : non-bloquant, garanti livraison, ne freeze pas la nav
    navigator.sendBeacon("/api/views", JSON.stringify({ page: pathname }));
  }, [pathname]);

  return null;
}
