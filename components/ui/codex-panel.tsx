"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: [number, number, number];
  size: number;
}

const COLORS: [number, number, number][] = [
  [100, 160, 255],
  [140, 100, 255],
  [80,  200, 200],
  [180, 120, 255],
  [60,  180, 255],
];

export function CodexPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const MAX = 120;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const spawn = (): Particle => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const edge  = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * W(); y = 0; }
      else if (edge === 1) { x = W(); y = Math.random() * H(); }
      else if (edge === 2) { x = Math.random() * W(); y = H(); }
      else                  { x = 0; y = Math.random() * H(); }

      const angle  = Math.random() * Math.PI * 2;
      const speed  = 0.3 + Math.random() * 0.6;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 180 + Math.floor(Math.random() * 200),
        color,
        size: 1 + Math.random() * 1.5,
      };
    };

    // Pre-fill
    for (let i = 0; i < MAX; i++) {
      const p = spawn();
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }

    const CONN_DIST = 90;

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Deep dark base
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Soft center glow
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.65);
      glow.addColorStop(0, "rgba(80,60,160,0.18)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Soft drift
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;
        p.vx *= 0.99;
        p.vy *= 0.99;

        const progress = p.life / p.maxLife;
        const alpha    = progress < 0.15
          ? progress / 0.15
          : progress > 0.75
            ? 1 - (progress - 0.75) / 0.25
            : 1;

        const [r, g, b] = p.color;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.85})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) {
            const lineAlpha = (1 - dist / CONN_DIST) * alpha * 0.3;
            const qp = q.life / q.maxLife;
            const qa = qp < 0.15 ? qp / 0.15 : qp > 0.75 ? 1 - (qp - 0.75) / 0.25 : 1;
            const la = lineAlpha * qa;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${la})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (p.life >= p.maxLife || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles[i] = spawn();
        }
      }

      // Vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
      vig.addColorStop(0, "rgba(5,5,8,0)");
      vig.addColorStop(1, "rgba(5,5,8,0.65)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      while (particles.length < MAX) particles.push(spawn());

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
