import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X, ArrowRight } from 'lucide-react';

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
    <header className="sticky top-2 sm:top-4 z-50 w-full px-1 sm:px-0">
      <div className="rounded-[24px] sm:rounded-full bg-[#0D0B14]/70 backdrop-blur-2xl border border-white/[0.08] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
        
        {/* Brand Logo with reference '} ' marker */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-violet-400 font-mono text-xl font-bold tracking-tight select-none">
            &#125;
          </span>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
            Verado
          </span>
        </Link>

        {/* Desktop Navigation Links (Clean, elegant, no nested pill box) */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                isActive(link.path)
                  ? 'bg-white/[0.10] text-white border border-white/15 font-semibold shadow-sm backdrop-blur-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <span>GET IN TOUCH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover:animate-ping" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 rounded-[24px] border border-white/[0.08] bg-[#0D0B14]/95 backdrop-blur-2xl p-5 space-y-3 shadow-2xl animate-in slide-in-from-top-3">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white border border-white/15 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08]">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors"
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
