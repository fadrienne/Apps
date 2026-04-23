import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import Header from '../components/Header';
import { revenueData, memberGrowthData, serviceUsageData } from '../data/mockData';

const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;

const kpis = [
  { label: 'YTD Revenue', value: '$238,700', change: 18.4, up: true },
  { label: 'YTD Members Joined', value: '154', change: 22.1, up: true },
  { label: 'Avg Revenue / Member', value: '$130.6', change: -3.2, up: false },
  { label: 'Churn Rate', value: '3.1%', change: -12.5, up: true },
];

export default function Reports() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Reports" subtitle="Business analytics and insights" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Action bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Period: October 2025 – April 2026</p>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* KPI summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {k.up ? (
                  <TrendingUp size={13} className="text-green-500" />
                ) : (
                  <TrendingDown size={13} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${k.up ? 'text-green-600' : 'text-red-600'}`}>
                  {k.change > 0 ? '+' : ''}{k.change}% YoY
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Monthly Revenue vs Expenses</h2>
          <p className="text-xs text-gray-500 mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="repRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#repRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fill="none" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Member growth line chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Cumulative Member Count</h2>
            <p className="text-xs text-gray-500 mb-4">Growth trajectory</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} name="Total Members" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sessions by service */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Sessions by Service</h2>
            <p className="text-xs text-gray-500 mb-4">All-time total</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={serviceUsageData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip />
                <Bar dataKey="sessions" radius={[0, 4, 4, 0]} name="Sessions">
                  {serviceUsageData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
