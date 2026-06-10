import { useState } from 'react';
import { Search, Filter, PlusCircle, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { useCollection } from '../hooks/useCollection';
import { addBooking, removeBooking, updateBookingStatus } from '../lib/db';
import type { Booking } from '../types';

const today = new Date().toISOString().split('T')[0];
const blank = { memberName:'', service:'', staff:'', date:today, time:'09:00', duration:60, status:'Confirmed' as Booking['status'], amount:0 };

export default function Bookings() {
  const { data: bookings, loading } = useCollection<Booking>('bookings');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      return (b.memberName.toLowerCase().includes(q) || b.service.toLowerCase().includes(q))
        && (filterStatus === 'All' || b.status === filterStatus);
    })
    .sort((a,b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time));

  const totalRevenue = bookings.filter(b=>b.status!=='Cancelled').reduce((s,b)=>s+b.amount,0);
  const counts = { Confirmed:0, Pending:0, Completed:0, Cancelled:0 };
  bookings.forEach(b => { counts[b.status]++; });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addBooking(form);
    setShowAdd(false);
    setForm(blank);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this booking?')) await removeBooking(id);
  };

  const handleStatus = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Bookings" subtitle="Manage and track all appointments"/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(counts) as [string,number][]).map(([status,count])=>(
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
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none w-40"/>
          </div>
          <Filter size={14} className="text-gray-400"/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none">
            {['All','Confirmed','Pending','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg">
            <PlusCircle size={14}/>New
          </button>
        </div>

        {loading
          ? <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
          : <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Member</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Service</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">$</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3"/>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0
                      ? <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-400">No bookings yet — add your first booking above</td></tr>
                      : filtered.map(b=>(
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800 text-xs">{b.memberName}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{b.service}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.date} {b.time}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-800 text-xs">${b.amount}</td>
                            <td className="px-4 py-3 text-center">
                              <select value={b.status} onChange={e=>handleStatus(b.id, e.target.value as Booking['status'])} className="text-xs border border-gray-100 rounded-lg px-1 py-0.5 bg-white focus:outline-none">
                                {(['Confirmed','Pending','Completed','Cancelled'] as Booking['status'][]).map(s=><option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={()=>handleDelete(b.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
                            </td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">New Booking</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.memberName} onChange={e=>setForm({...form,memberName:e.target.value})} placeholder="Member name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input required value={form.service} onChange={e=>setForm({...form,service:e.target.value})} placeholder="Service (e.g. Personal Training)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input required value={form.staff} onChange={e=>setForm({...form,staff:e.target.value})} placeholder="Staff member name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Time</label>
                  <input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Duration (min)</label>
                  <input type="number" required value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Amount ($)</label>
                  <input type="number" required value={form.amount} onChange={e=>setForm({...form,amount:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
              </div>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value as Booking['status']})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {(['Confirmed','Pending','Completed','Cancelled'] as Booking['status'][]).map(s=><option key={s}>{s}</option>)}
              </select>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
