import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function Layout() {
  const { isOpen, close } = useSidebar();
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={close}
        />
      )}
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-60 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    </BrowserRouter>
  );
}
