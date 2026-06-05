"use client";

import dynamic from "next/dynamic";

export const AnimatedBackground = dynamic(
  () => import("./animated-background").then((m) => ({ default: m.AnimatedBackground })),
  { ssr: false }
);
