import { Bell, Search, Menu } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggle}
          className="md:hidden p-2 -ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-48"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">TH</span>
        </div>
      </div>
    </header>
  );
}
