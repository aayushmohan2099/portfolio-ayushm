// src/Components/Title/Components/InteractiveGridBg.jsx
import React, { useEffect, useRef } from 'react';

const InteractiveGridBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let points = [];
    let width, height, cols, rows;

    // 1. SPHERE SIZE FIX: 
    // Reduced radius from 200 to 120 so the distortion circle is smaller
    const options = {
      gridSpacing: 40,
      radius: 120,
      showLines: true,
      showBalls: true,
    };

    // Track mouse position
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Point {
      constructor(x, y, indexX, indexY) {
        this.x = x;
        this.y = y;
        this.vx = x;
        this.vy = y;
        this.index = { x: indexX, y: indexY };
        this.size = 3;
        this.originalSize = 3;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. THE GLITCH FIX: Proximity factor (0 to 1)
        // If distance > radius, proximity is 0, meaning the mouse has NO effect.
        const proximity = Math.max(0, 1 - distance / options.radius);

        // Size distortion (Reduced intensity by dividing by 6 instead of 4)
        if (distance < options.radius) {
          this.size = this.originalSize + (options.radius - distance) / 6;
        } else {
          this.size = Math.max(this.originalSize, this.size - (this.originalSize * 0.05));
        }

        const damp = this.size * 0.01;

        // Calculate where the point *wants* to be.
        // We multiply by proximity so the grid doesn't globally shift to (-1000, -1000) on load.
        const targetVx = this.x - (dx * damp * proximity);
        const targetVy = this.y - (dy * damp * proximity);

        // SMOOTHING: Easing the movement (lerp) so it glides smoothly instead of snapping.
        this.vx += (targetVx - this.vx) * 0.15;
        this.vy += (targetVy - this.vy) * 0.15;

        if (options.showBalls) {
          ctx.beginPath();
          const r = Math.min(255, 3 + ~~(this.size * 6));
          const g = Math.max(0, 233 - ~~(this.size * 4));
          const b = Math.min(255, 244 + ~~(this.size * 2));

          ctx.strokeStyle = `rgb(${r},${g},${b})`;
          ctx.arc(this.vx, this.vy, this.size * damp, 0, 2 * Math.PI, false);
          ctx.stroke();
        }
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      cols = Math.floor(width / options.gridSpacing);
      rows = Math.floor(height / options.gridSpacing);

      points = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.push(
            new Point(
              (options.gridSpacing / 2) + x * options.gridSpacing,
              (options.gridSpacing / 2) + y * options.gridSpacing,
              x,
              y
            )
          );
        }
      }
    };

    const drawLine = (p1, p2) => {
      ctx.beginPath();
      ctx.strokeStyle = options.showBalls ? 'rgba(3, 233, 244, 0.3)' : '#009966';
      ctx.moveTo(p1.vx, p1.vy);
      ctx.lineTo(p2.vx, p2.vy);
      ctx.stroke();
    };

    const connectPoints = (i) => {
      const p1 = points[i];
      if (p1.index.x < cols - 1) {
        drawLine(p1, points[i + 1]);
      }
      if (p1.index.y < rows - 1) {
        if (points[i + cols]) {
          drawLine(p1, points[i + cols]);
        }
      }
    };

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        points[i].update();
        if (options.showLines) {
          connectPoints(i);
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    init();
    renderLoop();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default InteractiveGridBg;