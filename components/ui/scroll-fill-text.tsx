"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollFillText({
  children,
  color = "#5C5CF5",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "center 0.42"],
  });

  // Spring fluide — inertie plus longue pour l'effet "liquide"
  const spring = useSpring(scrollYProgress, { stiffness: 35, damping: 14, mass: 1 });

  // Le gradient fait 200% de large : moitié violette à gauche, moitié blanche à droite.
  // backgroundPosition glisse de 100% → 0% = la partie violette entre de la gauche.
  const bgPos = useTransform(spring, (v) => `${(1 - v) * 100}% 0%`);

  return (
    <motion.span
      ref={ref}
      style={{
        display: "block",
        background: `linear-gradient(to right, ${color} 50%, white 50%)`,
        backgroundSize: "200% 100%",
        backgroundPosition: bgPos,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {children}
    </motion.span>
  );
}
