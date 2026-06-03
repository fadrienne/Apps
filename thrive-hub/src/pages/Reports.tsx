import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import Header from '../components/Header';
import { revenueData, memberGrowthData, serviceUsageData } from '../data/mockData';

const fmt = (n: number) => `$${(n/1000).toFixed(0)}k`;
const kpis = [
  { label:'YTD Revenue', value:'$238,700', change:18.4, up:true },
  { label:'Members Joined', value:'154', change:22.1, up:true },
  { label:'Avg Rev/Member', value:'$130.6', change:-3.2, up:false },
  { label:'Churn Rate', value:'3.1%', change:-12.5, up:true },
];

export default function Reports() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Reports" subtitle="Business analytics and insights" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Oct 2025 – Apr 2026</p>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600"><Download size={13}/>Export</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500">{k.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{k.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {k.up ? <TrendingUp size={12} className="text-green-500"/> : <TrendingDown size={12} className="text-red-500"/>}
                <span className={`text-xs font-medium ${k.up?'text-green-600':'text-red-600'}`}>{k.change>0?'+':''}{k.change}% YoY</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="rr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={fmt} tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']}/>
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#rr)" name="Revenue"/>
              <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fill="none" name="Expenses"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Member Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false} domain={['auto','auto']}/>
              <Tooltip/>
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r:3, fill:'#3b82f6' }} name="Total Members"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Sessions by Service</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceUsageData} layout="vertical" margin={{ left:0, right:16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} width={110}/>
              <Tooltip/>
              <Bar dataKey="sessions" radius={[0,4,4,0]} name="Sessions">
                {serviceUsageData.map((e,i) => <rect key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
