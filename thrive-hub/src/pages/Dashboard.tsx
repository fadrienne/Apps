import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Users, DollarSign, CalendarCheck, TrendingUp, Star } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import { revenueData, memberGrowthData, serviceUsageData, bookings, staff } from '../data/mockData';

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

const todayBookings = bookings.filter(b => b.date === '2026-04-23');

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back — here's what's happening at Thrive Hub today."
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            label="Total Members"
            value={315}
            change={12}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <MetricCard
            label="Monthly Revenue"
            value="41,200"
            change={7.3}
            icon={DollarSign}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            prefix="$"
          />
          <MetricCard
            label="Sessions This Month"
            value={224}
            change={5.8}
            icon={CalendarCheck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          <MetricCard
            label="Avg. Session Rating"
            value="4.8"
            change={2.1}
            icon={Star}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
            suffix=" / 5"
          />
        </div>

        {/* Revenue + Member Growth charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Revenue Overview</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 7 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-300 inline-block" />Expenses</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />Profit</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#60a5fa" strokeWidth={2} fill="url(#colorProfit)" name="Profit" />
                <Area type="monotone" dataKey="expenses" stroke="#d1d5db" strokeWidth={1.5} fill="none" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Usage Pie */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Service Breakdown</h2>
              <p className="text-xs text-gray-500 mt-0.5">Total sessions by service</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={serviceUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="sessions"
                >
                  {serviceUsageData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [Number(v), 'Sessions']} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1.5">
              {serviceUsageData.slice(0, 4).map(s => (
                <li key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.fill }} />
                    <span className="text-gray-600">{s.name}</span>
                  </span>
                  <span className="font-medium text-gray-800">{s.sessions}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Member Growth + Today's Bookings */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Member Growth */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Member Growth</h2>
              <p className="text-xs text-gray-500 mt-0.5">New vs churned members per month</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={memberGrowthData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="newMembers" name="New Members" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" name="Churned" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Today's Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Today's Bookings</h2>
              <p className="text-xs text-gray-500 mt-0.5">April 23, 2026</p>
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto">
              {todayBookings.map(b => (
                <li key={b.id} className="flex items-start gap-3">
                  <div className="mt-0.5 text-center">
                    <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">{b.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.memberName}</p>
                    <p className="text-xs text-gray-500 truncate">{b.service} · {b.staff}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Staff */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Top Staff Performance</h2>
              <p className="text-xs text-gray-500 mt-0.5">This month</p>
            </div>
            <TrendingUp size={16} className="text-brand-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-xs font-medium text-gray-500">Name</th>
                  <th className="text-left pb-2 text-xs font-medium text-gray-500">Role</th>
                  <th className="text-right pb-2 text-xs font-medium text-gray-500">Sessions</th>
                  <th className="text-right pb-2 text-xs font-medium text-gray-500">Revenue</th>
                  <th className="text-right pb-2 text-xs font-medium text-gray-500">Rating</th>
                  <th className="text-center pb-2 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={s.avatar} size="sm" />
                        <span className="font-medium text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-500">{s.role}</td>
                    <td className="py-3 text-right text-gray-700">{s.sessionsThisMonth}</td>
                    <td className="py-3 text-right font-medium text-gray-800">${s.revenue.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        {s.rating}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge status={s.status} />
                    </td>
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
