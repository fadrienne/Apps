import { Star, Users, CalendarCheck, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import { staff } from '../data/mockData';

export default function Staff() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Staff" subtitle="Team performance and availability" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            <p className="text-sm text-gray-500 mt-0.5">Total Staff</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {staff.filter(s => s.status === 'Available').length}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">Available Now</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {staff.reduce((sum, s) => sum + s.sessionsThisMonth, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">Sessions This Month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              ${staff.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">Revenue Generated</p>
          </div>
        </div>

        {/* Staff cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={s.avatar} size="lg" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.specialization}</p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Star size={13} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.rating}</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Users size={13} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.totalClients}</p>
                    <p className="text-xs text-gray-400">Clients</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CalendarCheck size={13} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.sessionsThisMonth}</p>
                    <p className="text-xs text-gray-400">Sessions/mo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={13} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">${s.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
