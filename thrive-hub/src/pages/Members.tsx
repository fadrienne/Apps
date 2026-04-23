import { useState } from 'react';
import { Search, UserPlus, Filter } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import { members } from '../data/mockData';
import type { Member } from '../types';

const planColors: Record<Member['plan'], string> = {
  Basic: 'bg-gray-100 text-gray-600',
  Premium: 'bg-blue-100 text-blue-700',
  Elite: 'bg-purple-100 text-purple-700',
};

export default function Members() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPlan, setFilterPlan] = useState<string>('All');

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchPlan = filterPlan === 'All' || m.plan === filterPlan;
    return matchSearch && matchStatus && matchPlan;
  });

  const counts = {
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    inactive: members.filter(m => m.status === 'Inactive').length,
    pending: members.filter(m => m.status === 'Pending').length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Members" subtitle={`${counts.total} total members`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Total', value: counts.total, color: 'bg-gray-100 text-gray-700' },
            { label: 'Active', value: counts.active, color: 'bg-green-100 text-green-700' },
            { label: 'Inactive', value: counts.inactive, color: 'bg-gray-100 text-gray-500' },
            { label: 'Pending', value: counts.pending, color: 'bg-yellow-100 text-yellow-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`px-4 py-2 rounded-lg text-sm font-medium ${color}`}>
              {value} {label}
            </div>
          ))}
        </div>

        {/* Filters + Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members…"
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
                {['All', 'Active', 'Inactive', 'Pending'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                value={filterPlan}
                onChange={e => setFilterPlan(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {['All', 'Basic', 'Premium', 'Elite'].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <UserPlus size={15} />
            Add Member
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Member</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Last Visit</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Sessions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.avatar} />
                      <div>
                        <p className="font-medium text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[m.plan]}`}>
                      {m.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{m.joinDate}</td>
                  <td className="px-5 py-3.5 text-gray-500">{m.lastVisit}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-700">{m.totalSessions}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                    No members match your filters.
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
