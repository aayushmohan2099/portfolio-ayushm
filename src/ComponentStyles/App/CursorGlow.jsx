// src/ComponentStyles/App/CursorGlow.jsx
import React, { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        // We offset by 30px so the 60x60px glow is perfectly centered on the mouse tip
        glowRef.current.style.transform = `translate(${e.clientX - 30}px, ${e.clientY - 30}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      // Fixed, sitting on top of everything, but ignores all clicks
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
      style={{
        width: '60px',
        height: '60px',
        // The exact color you requested fading out from the center
        background: 'radial-gradient(circle, rgba(3, 232, 244, 0.29) 0%, rgba(3, 232, 244, 0) 100%)',
        // An extra soft box-shadow to extend the glow
        boxShadow: '0 0 20px 10px rgba(3, 233, 244, 0.1)',
        willChange: 'transform',
      }}
    />
  );
};

export default CursorGlow;