import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-2 sm:top-4 z-50 w-full">
      <div className="rounded-[28px] sm:rounded-full bg-[#0F0E11]/92 backdrop-blur-xl border border-white/10 px-5 sm:px-7 py-3 sm:py-3.5 flex items-center justify-between shadow-2xl shadow-purple-950/20 transition-all">
        
        {/* Brand Logo with reference '} ' marker */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-violet-400 font-mono text-xl font-bold tracking-tight select-none">
            &#125;
          </span>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
            Verado
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#16151B] p-1 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                isActive(link.path)
                  ? 'bg-black text-white border border-white/20 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/60 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <span>GET IN TOUCH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover:animate-ping" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-black border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 rounded-[28px] border border-white/10 bg-[#0F0E11]/98 backdrop-blur-xl p-5 space-y-3 shadow-2xl animate-in slide-in-from-top-3">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'bg-black text-white border border-white/20 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-mono uppercase tracking-wider bg-black hover:bg-[#16151B] text-white border border-white/20 transition-colors"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
