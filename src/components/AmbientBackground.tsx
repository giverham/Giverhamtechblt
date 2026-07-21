import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.15, y: 0.15, r: 380, c: '0,229,255',  sp: 0.00018, ph: 0 },
      { x: 0.88, y: 0.22, r: 300, c: '0,255,209',  sp: 0.00025, ph: 2.1 },
      { x: 0.50, y: 0.55, r: 260, c: '59,130,246', sp: 0.00020, ph: 1.0 },
      { x: 0.10, y: 0.75, r: 320, c: '0,229,255',  sp: 0.00015, ph: 3.5 },
      { x: 0.90, y: 0.80, r: 280, c: '0,255,209',  sp: 0.00022, ph: 0.8 },
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      t++;

      for (const orb of orbs) {
        const px = orb.x * w + Math.sin(t * orb.sp + orb.ph) * 100;
        const py = orb.y * h + Math.cos(t * orb.sp * 0.7 + orb.ph) * 70;
        const alpha = 0.05 + Math.sin(t * 0.001 + orb.ph) * 0.015;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, orb.r);
        grad.addColorStop(0,   `rgba(${orb.c},${alpha.toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${orb.c},${(alpha * 0.35).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${orb.c},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 1, mixBlendMode: 'screen' }}
    />
  );
}
