import { Star, Users, CalendarCheck, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import { staff } from '../data/mockData';

export default function Staff() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Staff" subtitle="Team performance and availability" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.length}</p><p className="text-xs text-gray-500">Total Staff</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.filter(s=>s.status==='Available').length}</p><p className="text-xs text-gray-500">Available Now</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.reduce((sum,s)=>sum+s.sessionsThisMonth,0)}</p><p className="text-xs text-gray-500">Sessions/Month</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">${staff.reduce((sum,s)=>sum+s.revenue,0).toLocaleString()}</p><p className="text-xs text-gray-500">Revenue</p></div>
        </div>
        <div className="space-y-3">
          {staff.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={s.avatar} size="lg"/>
                  <div><h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3><p className="text-xs text-gray-500">{s.role}</p><p className="text-xs text-gray-400">{s.specialization}</p></div>
                </div>
                <StatusBadge status={s.status}/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{icon:Star,color:'text-yellow-500',bg:'bg-yellow-50',val:s.rating,label:'Rating'},{icon:Users,color:'text-blue-500',bg:'bg-blue-50',val:s.totalClients,label:'Clients'},{icon:CalendarCheck,color:'text-green-500',bg:'bg-green-50',val:s.sessionsThisMonth,label:'Sessions'},{icon:DollarSign,color:'text-purple-500',bg:'bg-purple-50',val:`$${s.revenue.toLocaleString()}`,label:'Revenue'}].map(({icon:Icon,color,bg,val,label})=>(
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}><Icon size={13} className={color}/></div>
                    <div><p className="text-sm font-semibold text-gray-800">{val}</p><p className="text-xs text-gray-400">{label}</p></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
