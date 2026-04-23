import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-60 flex flex-col overflow-hidden">
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
    </BrowserRouter>
  );
}
