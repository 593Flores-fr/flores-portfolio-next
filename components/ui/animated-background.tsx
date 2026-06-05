"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import UnicornScene from "unicornstudio-react/next";

interface Props {
  projectId?: string;
  className?: string;
}

export function AnimatedBackground({
  projectId = "cbmTT38A0CcuYxeiyj5H",
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const { offsetWidth, offsetHeight } = wrapRef.current;
      setSize({ width: offsetWidth, height: offsetHeight });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("w-full h-full overflow-hidden pointer-events-none", className)}
    >
      {size.width > 0 && size.height > 0 && (
        <UnicornScene
          production={true}
          projectId={projectId}
          width={size.width}
          height={size.height}
        />
      )}
    </div>
  );
}
