import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarDays, Dumbbell,
  UserCheck, BarChart3, Settings, Zap,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/services', icon: Dumbbell, label: 'Services' },
  { to: '/staff', icon: UserCheck, label: 'Staff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  const { isOpen, isDesktop, close } = useSidebar();
  const visible = isDesktop || isOpen;
  const w = isDesktop ? 240 : 240;

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: w,
        background: '#111827',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 300ms ease-in-out',
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 600, fontSize: 14, margin: 0 }}>Thrive Hub</p>
          <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Business Suite</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={close}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 2,
              background: isActive ? '#16a34a' : 'transparent',
              color: isActive ? 'white' : '#9ca3af',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            })}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid #1f2937' }}>
        <NavLink
          to="/settings"
          onClick={close}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, color: '#9ca3af', textDecoration: 'none', fontSize: 14 }}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
