import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Users, DollarSign, CalendarCheck, TrendingUp, Star } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import { useCollection } from '../hooks/useCollection';
import type { Member, Booking, StaffMember } from '../types';

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#ef4444'];
const fmt = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`;

function monthRange(back: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - back);
  return { label: d.toLocaleString('default',{month:'short'}), m: d.getMonth(), y: d.getFullYear() };
}

export default function Dashboard() {
  const { data: members } = useCollection<Member>('members');
  const { data: bookings } = useCollection<Booking>('bookings');
  const { data: staff } = useCollection<StaffMember>('staff');

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const cm = now.getMonth(), cy = now.getFullYear();

  const activeMembers = useMemo(() => members.filter(m => m.status === 'Active').length, [members]);

  const monthlyRevenue = useMemo(() =>
    bookings.filter(b => { const d = new Date(b.date); return d.getMonth()===cm && d.getFullYear()===cy && b.status!=='Cancelled'; })
      .reduce((s,b) => s+b.amount, 0),
  [bookings, cm, cy]);

  const sessionsThisMonth = useMemo(() =>
    bookings.filter(b => { const d = new Date(b.date); return d.getMonth()===cm && d.getFullYear()===cy && b.status!=='Cancelled'; }).length,
  [bookings, cm, cy]);

  const avgRating = useMemo(() =>
    staff.length ? (staff.reduce((s,m) => s+m.rating,0)/staff.length).toFixed(1) : '—',
  [staff]);

  const revenueChart = useMemo(() =>
    Array.from({length:6},(_,i) => {
      const {label,m,y} = monthRange(5-i);
      const revenue = bookings.filter(b=>{const d=new Date(b.date);return d.getMonth()===m&&d.getFullYear()===y&&b.status!=='Cancelled';}).reduce((s,b)=>s+b.amount,0);
      return {month:label,revenue};
    }),
  [bookings]);

  const growthChart = useMemo(() =>
    Array.from({length:6},(_,i) => {
      const {label,m,y} = monthRange(5-i);
      const newMembers = members.filter(mem=>{const d=new Date(mem.joinDate);return d.getMonth()===m&&d.getFullYear()===y;}).length;
      return {month:label,newMembers};
    }),
  [members]);

  const serviceChart = useMemo(() => {
    const counts: Record<string,number> = {};
    bookings.forEach(b=>{ if(b.status!=='Cancelled') counts[b.service]=(counts[b.service]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,sessions],i)=>({name,sessions,fill:COLORS[i%COLORS.length]}));
  }, [bookings]);

  const todayBookings = useMemo(() =>
    bookings.filter(b=>b.date===today).sort((a,b)=>a.time.localeCompare(b.time)),
  [bookings, today]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Welcome back — here's what's happening at Thrive Hub today." />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricCard label="Total Members" value={activeMembers} change={0} icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <MetricCard label="Monthly Revenue" value={monthlyRevenue.toLocaleString()} change={0} icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" prefix="$" />
          <MetricCard label="Sessions This Month" value={sessionsThisMonth} change={0} icon={CalendarCheck} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <MetricCard label="Avg. Staff Rating" value={`${avgRating} / 5`} change={0} icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Revenue Overview</h2>
          <p className="text-xs text-gray-500 mb-3">Last 6 months (from bookings)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart} margin={{top:4,right:4,left:0,bottom:0}}>
              <defs>
                <linearGradient id="cR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={fmt} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>[`$${Number(v).toLocaleString()}`,'Revenue']}/>
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#cR)" name="Revenue"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Member Growth</h2>
          <p className="text-xs text-gray-500 mb-3">New members per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={growthChart} margin={{top:4,right:4,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="newMembers" name="New Members" fill="#22c55e" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {serviceChart.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Service Breakdown</h2>
            <p className="text-xs text-gray-500 mb-2">Sessions by service</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={serviceChart} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="sessions">
                  {serviceChart.map((e,i) => <Cell key={i} fill={e.fill}/>)}
                </Pie>
                <Tooltip formatter={(v)=>[Number(v),'Sessions']}/>
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1">
              {serviceChart.slice(0,4).map(s => (
                <li key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:s.fill}}/>
                    <span className="text-gray-600">{s.name}</span>
                  </span>
                  <span className="font-medium text-gray-800">{s.sessions}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Today's Bookings</h2>
            <TrendingUp size={16} className="text-green-500"/>
          </div>
          {todayBookings.length === 0
            ? <p className="text-xs text-gray-400 text-center py-4">No bookings for today</p>
            : <ul className="space-y-3">
                {todayBookings.map(b => (
                  <li key={b.id} className="flex items-start gap-3">
                    <p className="text-xs font-semibold text-gray-700 whitespace-nowrap mt-0.5">{b.time}</p>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{b.memberName}</p>
                      <p className="text-xs text-gray-500 truncate">{b.service} · {b.staff}</p>
                    </div>
                    <StatusBadge status={b.status}/>
                  </li>
                ))}
              </ul>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Staff Performance</h2>
          {staff.length === 0
            ? <p className="text-xs text-gray-400 text-center py-4">No staff added yet — go to Staff to add team members</p>
            : <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left pb-2 text-xs font-medium text-gray-500">Name</th>
                    <th className="text-right pb-2 text-xs font-medium text-gray-500">Sessions</th>
                    <th className="text-right pb-2 text-xs font-medium text-gray-500">Revenue</th>
                    <th className="text-right pb-2 text-xs font-medium text-gray-500">Rating</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {staff.map(s => (
                      <tr key={s.id}>
                        <td className="py-2.5"><div className="flex items-center gap-2"><Avatar initials={s.avatar} size="sm"/><span className="font-medium text-gray-800 text-xs">{s.name}</span></div></td>
                        <td className="py-2.5 text-right text-gray-700 text-xs">{s.sessionsThisMonth}</td>
                        <td className="py-2.5 text-right font-medium text-gray-800 text-xs">${s.revenue.toLocaleString()}</td>
                        <td className="py-2.5 text-right text-xs"><span className="flex items-center justify-end gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400"/>{s.rating}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>

      </div>
    </div>
  );
}
