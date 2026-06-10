import { useState } from 'react';
import { Search, UserPlus, Filter, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import { useCollection } from '../hooks/useCollection';
import { addMember, removeMember } from '../lib/db';
import type { Member } from '../types';

const planColors: Record<Member['plan'], string> = {
  Basic: 'bg-gray-100 text-gray-600',
  Premium: 'bg-blue-100 text-blue-700',
  Elite: 'bg-purple-100 text-purple-700',
};

const blank = { name:'', email:'', plan:'Basic' as Member['plan'], status:'Active' as Member['status'], joinDate: new Date().toISOString().split('T')[0] };

export default function Members() {
  const { data: members, loading } = useCollection<Member>('members');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      && (filterStatus === 'All' || m.status === filterStatus)
      && (filterPlan === 'All' || m.plan === filterPlan);
  });

  const counts = {
    total: members.length,
    active: members.filter(m=>m.status==='Active').length,
    inactive: members.filter(m=>m.status==='Inactive').length,
    pending: members.filter(m=>m.status==='Pending').length,
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const initials = form.name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    await addMember({ ...form, avatar: initials, lastVisit: '—', totalSessions: 0 });
    setShowAdd(false);
    setForm(blank);
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) await removeMember(id);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Members" subtitle={`${counts.total} total members`}/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="flex gap-2 flex-wrap">
          {([['Total',counts.total,'bg-gray-100 text-gray-700'],['Active',counts.active,'bg-green-100 text-green-700'],['Inactive',counts.inactive,'bg-gray-100 text-gray-500'],['Pending',counts.pending,'bg-yellow-100 text-yellow-700']] as [string,number,string][]).map(([label,val,color])=>(
            <div key={label} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${color}`}>{val} {label}</div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none w-44"/>
          </div>
          <Filter size={14} className="text-gray-400"/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none">
            {['All','Active','Inactive','Pending'].map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none">
            {['All','Basic','Premium','Elite'].map(p=><option key={p}>{p}</option>)}
          </select>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg">
            <UserPlus size={14}/>Add
          </button>
        </div>

        {loading
          ? <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
          : <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Member</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Plan</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Sessions</th>
                      <th className="px-4 py-3"/>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0
                      ? <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">No members yet — add your first member above</td></tr>
                      : filtered.map(m => (
                          <tr key={m.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={m.avatar} size="sm"/><div><p className="font-medium text-gray-800 text-xs">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div></div></td>
                            <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${planColors[m.plan]}`}>{m.plan}</span></td>
                            <td className="px-4 py-3"><StatusBadge status={m.status}/></td>
                            <td className="px-4 py-3 text-right font-medium text-gray-700 text-xs">{m.totalSessions}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={()=>handleDelete(m.id,m.name)} className="text-gray-300 hover:text-red-500 transition">
                                <Trash2 size={14}/>
                              </button>
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
          <div className="bg-white rounded-xl w-full max-w-sm p-5" onClick={e=>e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">Add Member</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <select value={form.plan} onChange={e=>setForm({...form,plan:e.target.value as Member['plan']})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {(['Basic','Premium','Elite'] as Member['plan'][]).map(p=><option key={p}>{p}</option>)}
              </select>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value as Member['status']})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {(['Active','Inactive','Pending'] as Member['status'][]).map(s=><option key={s}>{s}</option>)}
              </select>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Join Date</label>
                <input type="date" value={form.joinDate} onChange={e=>setForm({...form,joinDate:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
