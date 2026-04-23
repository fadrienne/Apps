import { Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-56"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">TH</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
