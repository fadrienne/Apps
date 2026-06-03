import { Bell, Menu } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { toggle, isDesktop } = useSidebar();

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderBottom: '1px solid #e5e7eb', flexShrink: 0, gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {!isDesktop && (
          <button
            onClick={toggle}
            style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: 8, flexShrink: 0 }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
          {subtitle && isDesktop && (
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{subtitle}</p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button style={{ position: 'relative', padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: 8 }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
        </button>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>TH</span>
        </div>
      </div>
    </header>
  );
}
