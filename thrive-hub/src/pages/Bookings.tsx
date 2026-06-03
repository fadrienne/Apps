import { useState } from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { bookings } from '../data/mockData';

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = bookings.filter(b => {
    const matchSearch = b.memberName.toLowerCase().includes(search.toLowerCase()) || b.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings.filter(b => b.status !== 'Cancelled').reduce((sum,b) => sum+b.amount, 0);
  const statusCounts = { Confirmed: bookings.filter(b=>b.status==='Confirmed').length, Pending: bookings.filter(b=>b.status==='Pending').length, Completed: bookings.filter(b=>b.status==='Completed').length, Cancelled: bookings.filter(b=>b.status==='Cancelled').length };

  return (
    <div className="flex flex-col h-full">
      <Header title="Bookings" subtitle="Manage and track all appointments" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(statusCounts) as [string,number][]).map(([status,count]) => (
            <div key={status} className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{status}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-sm text-gray-700">
          Revenue (excl. cancelled): <strong className="text-gray-900">${totalRevenue.toLocaleString()}</strong>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none w-40" />
          </div>
          <Filter size={14} className="text-gray-400" />
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none">
            {['All','Confirmed','Pending','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg"><PlusCircle size={14}/>New</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">$</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 text-xs">{b.memberName}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{b.service}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.date} {b.time}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800 text-xs">${b.amount}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={b.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
