import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Header from '../components/Header';
import { useCollection } from '../hooks/useCollection';
import type { Member, Booking } from '../types';

const fmt = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`;

function monthRange(back: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - back);
  return { label: d.toLocaleString('default',{month:'short'}), m: d.getMonth(), y: d.getFullYear() };
}

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#ef4444'];

export default function Reports() {
  const { data: members } = useCollection<Member>('members');
  const { data: bookings } = useCollection<Booking>('bookings');

  const ytdRevenue = useMemo(() => {
    const year = new Date().getFullYear();
    return bookings
      .filter(b => new Date(b.date).getFullYear() === year && b.status !== 'Cancelled')
      .reduce((s,b) => s+b.amount, 0);
  }, [bookings]);

  const ytdMembers = useMemo(() => {
    const year = new Date().getFullYear();
    return members.filter(m => new Date(m.joinDate).getFullYear() === year).length;
  }, [members]);

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const avgRevPerMember = activeMembers > 0 ? (ytdRevenue / activeMembers).toFixed(0) : '0';

  const revenueChart = useMemo(() =>
    Array.from({length:6},(_,i) => {
      const {label,m,y} = monthRange(5-i);
      const revenue = bookings.filter(b=>{const d=new Date(b.date);return d.getMonth()===m&&d.getFullYear()===y&&b.status!=='Cancelled';}).reduce((s,b)=>s+b.amount,0);
      return {month:label,revenue};
    }),
  [bookings]);

  const growthChart = useMemo(() => {
    let running = members.length;
    return Array.from({length:6},(_,i) => {
      const {label,m,y} = monthRange(i);
      const n = members.filter(mem=>{const d=new Date(mem.joinDate);return d.getMonth()===m&&d.getFullYear()===y;}).length;
      const point = {month:label,total:running,newMembers:n};
      if(i>0) running = Math.max(0, running-n);
      return point;
    }).reverse();
  }, [members]);

  const serviceChart = useMemo(() => {
    const counts: Record<string,number> = {};
    bookings.forEach(b=>{ if(b.status!=='Cancelled') counts[b.service]=(counts[b.service]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,sessions],i)=>({name,sessions,fill:COLORS[i%COLORS.length]}));
  }, [bookings]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Reports" subtitle="Business analytics and insights"/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid grid-cols-2 gap-3">
          {([
            { label:'YTD Revenue', value:`$${ytdRevenue.toLocaleString()}`, up:true },
            { label:'Members Joined YTD', value:String(ytdMembers), up:true },
            { label:'Avg Rev / Member', value:`$${avgRevPerMember}`, up:true },
            { label:'Active Members', value:String(activeMembers), up:true },
          ]).map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500">{k.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{k.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {k.up ? <TrendingUp size={12} className="text-green-500"/> : <TrendingDown size={12} className="text-red-500"/>}
                <span className="text-xs font-medium text-green-600">Live data</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Revenue (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart}>
              <defs><linearGradient id="rr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={fmt} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>[`$${Number(v).toLocaleString()}`,'Revenue']}/>
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#rr)" name="Revenue"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Member Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} domain={['auto','auto']}/>
              <Tooltip/>
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{r:3,fill:'#3b82f6'}} name="Total Members"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {serviceChart.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Sessions by Service</h2>
            <ResponsiveContainer width="100%" height={Math.max(180, serviceChart.length*36)}>
              <BarChart data={serviceChart} layout="vertical" margin={{left:0,right:16}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false}/>
                <XAxis type="number" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} width={120}/>
                <Tooltip/>
                <Bar dataKey="sessions" radius={[0,4,4,0]} name="Sessions">
                  {serviceChart.map((e,i)=><Bar key={i} dataKey="sessions" fill={e.fill}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}
