import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  UserCheck,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/services', icon: Dumbbell, label: 'Services' },
  { to: '/staff', icon: UserCheck, label: 'Staff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-gray-900 flex flex-col z-20">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Thrive Hub</p>
          <p className="text-gray-500 text-xs">Business Suite</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
