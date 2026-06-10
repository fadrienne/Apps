import { useState } from 'react';
import { Star, Clock, DollarSign, Users, PlusCircle, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { useCollection } from '../hooks/useCollection';
import { addService, removeService } from '../lib/db';
import type { Service } from '../types';

const categoryColors: Record<string, string> = {
  Fitness: 'bg-orange-100 text-orange-700',
  Wellness: 'bg-blue-100 text-blue-700',
  Health: 'bg-green-100 text-green-700',
};

const blank = { name:'', category:'Fitness', duration:60, price:0, totalBookings:0, rating:0, capacity:10, currentEnrolled:0 };

export default function Services() {
  const { data: services, loading } = useCollection<Service>('services');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const totalSessions = services.reduce((s,sv)=>s+sv.totalBookings,0);
  const totalRevenue = services.reduce((s,sv)=>s+sv.totalBookings*sv.price,0);
  const avgRating = services.length ? (services.reduce((s,sv)=>s+sv.rating,0)/services.length).toFixed(1) : '—';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addService(form);
    setShowAdd(false);
    setForm(blank);
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) await removeService(id);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Services" subtitle="All offerings and their performance"/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{services.length}</p><p className="text-xs text-gray-500">Total Services</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{totalSessions}</p><p className="text-xs text-gray-500">Total Sessions</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p><p className="text-xs text-gray-500">Total Revenue</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{avgRating}</p><p className="text-xs text-gray-500">Avg. Rating</p></div>
        </div>

        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg">
          <PlusCircle size={14}/>Add Service
        </button>

        {loading
          ? <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
          : services.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No services added yet — add your first service above</p>
            : <div className="space-y-3">
                {services.map(sv=>{
                  const pct = sv.capacity > 0 ? Math.round((sv.currentEnrolled/sv.capacity)*100) : 0;
                  return (
                    <div key={sv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{sv.name}</h3>
                          <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[sv.category]??'bg-gray-100 text-gray-600'}`}>{sv.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400"/><span className="text-sm font-medium text-gray-700">{sv.rating||'—'}</span></div>
                          <button onClick={()=>handleDelete(sv.id,sv.name)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div className="bg-gray-50 rounded-lg p-2"><Clock size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">{sv.duration}m</p></div>
                        <div className="bg-gray-50 rounded-lg p-2"><DollarSign size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">${sv.price}</p></div>
                        <div className="bg-gray-50 rounded-lg p-2"><Users size={12} className="mx-auto text-gray-400 mb-1"/><p className="text-xs font-semibold text-gray-800">{sv.totalBookings}</p></div>
                      </div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Utilization</span><span className="font-semibold text-gray-800">{pct}%</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width:`${pct}%`}}/></div>
                    </div>
                  );
                })}
              </div>
        }
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">Add Service</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Service name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Fitness','Wellness','Health'].map(c=><option key={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Duration (min)</label>
                  <input type="number" required value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Price ($)</label>
                  <input type="number" required value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Enrolled</label>
                  <input type="number" value={form.currentEnrolled} onChange={e=>setForm({...form,currentEnrolled:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
