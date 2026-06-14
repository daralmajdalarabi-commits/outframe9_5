import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      container.style.setProperty('--mouse-x', `${x}`);
      container.style.setProperty('--mouse-y', `${y}`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(139,0,0,0.4) 0%, transparent 70%)',
          transform: 'translate(calc(-50% + var(--mouse-x, 0) * 20px), calc(-50% + var(--mouse-y, 0) * 20px))',
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(244,196,48,0.3) 0%, transparent 70%)',
          transform: 'translate(calc(var(--mouse-x, 0) * -15px), calc(var(--mouse-y, 0) * -15px))',
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Floating geometric objects (CSS) */}
      <div className="absolute top-[15%] left-[10%] animate-float-slow">
        <div className="w-16 h-16 border border-[#8B0000]/30 rounded-lg rotate-45 bg-[#8B0000]/5" />
      </div>
      <div className="absolute top-[25%] right-[15%] animate-float-slower">
        <div className="w-20 h-20 border border-[#F4C430]/20 rounded-full bg-[#F4C430]/5" />
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float">
        <div className="w-12 h-12 border border-[#8B0000]/20 rounded-full" />
      </div>
      <div className="absolute bottom-[30%] right-[10%] animate-float-slow" style={{ animationDelay: '2s' }}>
        <div className="w-10 h-10 border border-[#8B0000]/25 rotate-12 bg-[#8B0000]/5" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </div>
      <div className="absolute top-[50%] left-[50%] animate-float-slower" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-8 border border-[#F4C430]/20 rounded-full bg-[#F4C430]/5" />
      </div>

      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#8B0000]/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.2 + Math.random() * 0.3,
          }}
        />
      ))}

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-3deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.3; }
          75% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 9s ease-in-out infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
