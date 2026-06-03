import { Star, Clock, DollarSign, Users } from 'lucide-react';
import Header from '../components/Header';
import { services } from '../data/mockData';

const categoryColors: Record<string, string> = {
  Fitness: 'bg-orange-100 text-orange-700',
  Wellness: 'bg-blue-100 text-blue-700',
  Health: 'bg-green-100 text-green-700',
};

export default function Services() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Services" subtitle="All offerings and their performance" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{services.length}</p><p className="text-xs text-gray-500">Total Services</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{services.reduce((s,sv)=>s+sv.totalBookings,0)}</p><p className="text-xs text-gray-500">Total Sessions</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">${services.reduce((s,sv)=>s+sv.totalBookings*sv.price,0).toLocaleString()}</p><p className="text-xs text-gray-500">Total Revenue</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{(services.reduce((s,sv)=>s+sv.rating,0)/services.length).toFixed(1)}</p><p className="text-xs text-gray-500">Avg. Rating</p></div>
        </div>
        <div className="space-y-3">
          {services.map(sv => {
            const pct = Math.round((sv.currentEnrolled/sv.capacity)*100);
            return (
              <div key={sv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="font-semibold text-gray-900 text-sm">{sv.name}</h3><span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[sv.category]??'bg-gray-100 text-gray-600'}`}>{sv.category}</span></div>
                  <div className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400"/><span className="text-sm font-medium text-gray-700">{sv.rating}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-gray-50 rounded-lg p-2"><Clock size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">{sv.duration}m</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><DollarSign size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">${sv.price}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><Users size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">{sv.totalBookings}</p></div>
                </div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Utilization</span><span className="font-semibold text-gray-800">{pct}%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width:`${pct}%` }}/></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
