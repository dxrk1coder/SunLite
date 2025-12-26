
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Terminal, Cpu, Database, Network } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Core');

  const steps = [
    { threshold: 20, text: 'Connecting to Database' },
    { threshold: 50, text: 'Synchronizing Assets' },
    { threshold: 80, text: 'Establishing Secure Link' },
    { threshold: 100, text: 'Welcome to SUNLITE.GG' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5;
        const currentStep = steps.find(s => next <= s.threshold);
        if (currentStep) setStatus(currentStep.text);
        return next >= 100 ? 100 : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Background Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon Container */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse scale-150" />
          <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl emerald-glow animate-float relative z-10 border-4 border-emerald-400/50">
            <ShieldCheck size={56} className="text-white drop-shadow-lg" />
          </div>
          
          {/* Orbiting Elements */}
          <div className="absolute inset-0 -m-4 animate-spin-slow pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-emerald-400 shadow-xl">
                <Cpu size={16} />
             </div>
          </div>
          <div className="absolute inset-0 -m-8 animate-spin-slow-reverse pointer-events-none">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-blue-400 shadow-xl">
                <Database size={16} />
             </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-minecraft text-emerald-400 tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            SUNLITE<span className="text-white">.GG</span>
          </h2>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
              <Terminal size={14} className="text-emerald-600 animate-pulse" />
              <span>{status}...</span>
            </div>
            
            <div className="text-[9px] text-slate-600 font-mono">
              [SYSTEM_LOG]: {Math.round(progress)}% COMPLETED
            </div>
          </div>
        </div>

        {/* Custom Progress Bar (Pixel/Minecraft Style) */}
        <div className="mt-10 w-72 h-4 bg-slate-950 rounded-lg p-1 border-2 border-slate-800 shadow-inner relative overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-sm transition-all duration-300 emerald-glow shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
          {/* Pixel highlights */}
          <div className="absolute inset-0 flex space-x-1 opacity-20 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className="h-full w-px bg-white/20" />
             ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s infinite linear;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s infinite linear;
        }
      `}</style>
    </div>
  );
};
