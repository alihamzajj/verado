import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDarkTheme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={`p-2 rounded-full border border-white/10 bg-[#16151B] hover:bg-black text-white hover:border-violet-400/50 transition-all shadow-sm cursor-pointer ${className}`}
      title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkTheme ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-violet-400" />}
    </button>
  );
};
