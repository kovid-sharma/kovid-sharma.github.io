import { useEffect, useRef } from 'react';
import { play, initAudio } from '@/lib/audio';

export default function Background({ showGrid = false }: { showGrid?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const connectedToMouse = new Set<number>();
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerdown', initAudio);

    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, ';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const bothActive = connectedToMouse.has(i) && connectedToMouse.has(j);
          const maxDist = bothActive ? 180 : 120;

          if (dist < maxDist) {
            ctx.beginPath();
            const opacity = bothActive ? (0.8 - dist / (maxDist * 1.25)) : (0.5 - dist / 240);
            ctx.strokeStyle = `${lineColor}${opacity})`;
            ctx.lineWidth = bothActive ? 1.5 : 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `${lineColor}${0.8 - distMouse / 187.5})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          if (!connectedToMouse.has(i)) {
            connectedToMouse.add(i);
            play('hover', (Math.random() - 0.5) * 800);
            console.log('Star connected! Playing sound...');
          }
        }

        const isActive = connectedToMouse.has(i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, isActive ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isActive 
          ? (isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)')
          : (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)');
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', initAudio);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-200/50 via-neutral-100/30 dark:from-neutral-800/20 dark:via-neutral-900/10 to-transparent pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      {showGrid && <div aria-hidden className="stage-grid pointer-events-none opacity-20" />}
    </div>
  );
}
