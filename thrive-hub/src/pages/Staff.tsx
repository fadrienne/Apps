import { useState } from 'react';
import { Star, Users, CalendarCheck, DollarSign, UserPlus, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import { useCollection } from '../hooks/useCollection';
import { addStaffMember, removeStaffMember } from '../lib/db';
import type { StaffMember } from '../types';

const blank = { name:'', role:'', specialization:'', rating:5.0, totalClients:0, sessionsThisMonth:0, revenue:0, status:'Available' as StaffMember['status'] };

export default function Staff() {
  const { data: staff, loading } = useCollection<StaffMember>('staff');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const initials = form.name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    await addStaffMember({ ...form, avatar: initials });
    setShowAdd(false);
    setForm(blank);
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from staff?`)) await removeStaffMember(id);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Staff" subtitle="Team performance and availability"/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.length}</p><p className="text-xs text-gray-500">Total Staff</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.filter(s=>s.status==='Available').length}</p><p className="text-xs text-gray-500">Available Now</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">{staff.reduce((s,m)=>s+m.sessionsThisMonth,0)}</p><p className="text-xs text-gray-500">Sessions/Month</p></div>
          <div className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xl font-bold text-gray-900">${staff.reduce((s,m)=>s+m.revenue,0).toLocaleString()}</p><p className="text-xs text-gray-500">Revenue</p></div>
        </div>

        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg">
          <UserPlus size={14}/>Add Staff Member
        </button>

        {loading
          ? <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
          : staff.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No staff added yet — add your first team member above</p>
            : <div className="space-y-3">
                {staff.map(s=>(
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={s.avatar} size="lg"/>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                          <p className="text-xs text-gray-500">{s.role}</p>
                          <p className="text-xs text-gray-400">{s.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.status}/>
                        <button onClick={()=>handleDelete(s.id,s.name)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        {icon:Star,color:'text-yellow-500',bg:'bg-yellow-50',val:s.rating,label:'Rating'},
                        {icon:Users,color:'text-blue-500',bg:'bg-blue-50',val:s.totalClients,label:'Clients'},
                        {icon:CalendarCheck,color:'text-green-500',bg:'bg-green-50',val:s.sessionsThisMonth,label:'Sessions'},
                        {icon:DollarSign,color:'text-purple-500',bg:'bg-purple-50',val:`$${s.revenue.toLocaleString()}`,label:'Revenue'},
                      ] as {icon: React.FC<{size?:number;className?:string}>;color:string;bg:string;val:number|string;label:string}[]).map(({icon:Icon,color,bg,val,label})=>(
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}><Icon size={13} className={color}/></div>
                          <div><p className="text-sm font-semibold text-gray-800">{val}</p><p className="text-xs text-gray-400">{label}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
        }
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">Add Staff Member</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input required value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Role (e.g. Senior Trainer)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} placeholder="Specialization (e.g. HIIT & Strength)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value as StaffMember['status']})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {(['Available','Busy','Off'] as StaffMember['status'][]).map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Clients</label>
                  <input type="number" value={form.totalClients} onChange={e=>setForm({...form,totalClients:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Sessions/mo</label>
                  <input type="number" value={form.sessionsThisMonth} onChange={e=>setForm({...form,sessionsThisMonth:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Revenue ($)</label>
                  <input type="number" value={form.revenue} onChange={e=>setForm({...form,revenue:Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
