import { useState } from 'react';
import { CalendarDays, Search, Filter, PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { bookings } from '../data/mockData';

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.memberName.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.staff.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  const statusCounts = {
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Completed: bookings.filter(b => b.status === 'Completed').length,
    Cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Bookings" subtitle="Manage and track all appointments" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
            <div key={status} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 mt-0.5">{status}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <CalendarDays size={18} className="text-brand-500" />
          <span className="text-sm text-gray-700">
            Total revenue from bookings (excl. cancelled):{' '}
            <strong className="text-gray-900">${totalRevenue.toLocaleString()}</strong>
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search bookings…"
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-56"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <PlusCircle size={15} />
            New Booking
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Member</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Service</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Staff</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Date & Time</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Amount</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{b.id}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{b.memberName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{b.service}</td>
                  <td className="px-5 py-3.5 text-gray-500">{b.staff}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{b.date} {b.time}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-800">${b.amount}</td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
