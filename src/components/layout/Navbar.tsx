import React, { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 h-14 flex items-center justify-between px-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between w-full">
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center group-hover:opacity-80 transition-opacity">
            <Network className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg uppercase">Amit Halder</span>
          <div className="hidden md:block h-4 w-[1px] bg-white/20 mx-2"></div>
          <span className="hidden md:block text-[10px] font-mono text-brand-blue opacity-80 uppercase tracking-widest">SYSTEM_STATUS: STABLE</span>
        </a>

        <div className="hidden md:flex gap-6 text-[10px] font-semibold uppercase tracking-widest items-center">
          <a href="#about" className="hover:text-white text-slate-400 cursor-pointer transition-colors">About</a>
          <a href="#skills" className="hover:text-white text-slate-400 cursor-pointer transition-colors">Stack</a>
          <a href="#projects" className="hover:text-white text-slate-400 cursor-pointer transition-colors">Projects</a>
        </div>

        <div className="flex gap-3 items-center">
          <a href="#contact" className="hidden sm:flex px-4 py-1.5 rounded-full bg-brand-blue text-black text-[10px] uppercase font-bold hover:bg-brand-blue/90 transition-colors">
            Contact Me
          </a>
        </div>
      </div>
    </nav>
  );
}
