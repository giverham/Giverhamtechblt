import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      // Dot: snap directly
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`;
        dotRef.current.style.top  = `${pos.current.y}px`;
      }
      // Ring: lag behind
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    // Hover state on interactive elements
    const addHover = () => document.body.classList.add('cursor-hovering');
    const rmHover  = () => document.body.classList.remove('cursor-hovering');

    const attachHover = () => {
      const els = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .cursor-hover');
      els.forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', rmHover);
      });
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);

    // Observe DOM mutations to re-attach hover to new elements
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHover();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
