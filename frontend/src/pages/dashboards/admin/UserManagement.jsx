import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Eye, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../../services/adminService';

const RoleBadge = ({ role }) => {
  const map = { 
    doctor: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20', 
    patient: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
    family: 'bg-rose-500/10 text-rose-400 border-rose-500/20', 
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
  };
  return <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${map[role] || 'bg-white/5 text-zinc-400 border-white/10'}`}>{role}</span>;
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('patient');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(tab);
      setUsers(res.data);
    } catch { 
      toast.error('Failed to load users', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); 
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [tab]);

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this user?')) return;
    try { 
      await adminService.suspendUser(id); 
      toast.success('User suspended', { style: { background: '#171717', color: '#fbbf24', border: '1px solid #78350f' }}); 
      fetchUsers(); 
    }
    catch { toast.error('Failed to suspend user', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); }
  };

  const handleActivate = async (id) => {
    try { 
      await adminService.activateUser(id); 
      toast.success('User activated', { style: { background: '#171717', color: '#34d399', border: '1px solid #064e3b' }}); 
      fetchUsers(); 
    }
    catch { toast.error('Failed to activate user', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try { 
      await adminService.deleteUser(id); 
      toast.success('User deleted successfully', { style: { background: '#171717', color: '#34d399', border: '1px solid #064e3b' }}); 
      fetchUsers(); 
    }
    catch { toast.error('Failed to delete user', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); }
  };

  const filtered = users.filter(u =>
    (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Bar: Tabs + Search */}
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] sm:rounded-full">
          {['patient','doctor','family'].map(r => (
            <button 
              key={r} 
              onClick={() => { setTab(r); setSearch(''); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-extrabold capitalize transition-all duration-300 ${
                tab === r 
                  ? 'bg-gradient-to-r from-zinc-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                  : 'bg-transparent text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {r}s
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-black border border-white/10 text-sm text-white placeholder-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none shadow-inner transition-all" 
          />
        </div>
      </div>

      {/* Table / Grid */}
      <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        {tab === 'family' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 relative z-10 px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zinc-800/30 rounded-full blur-[80px]" />
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative z-10">
              <Shield className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight relative z-10">Family Access Coming Soon</h3>
            <p className="text-zinc-500 font-medium max-w-md mx-auto relative z-10">We are currently building a secure, role-based family sharing module. This enterprise feature will be available in the next major update.</p>
            <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-400 relative z-10">
               <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> In Development
            </div>
          </motion.div>
        ) : loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-white border-l-zinc-500 animate-spin" />
            <p className="text-zinc-500 text-sm font-black uppercase tracking-widest">Loading Accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 relative z-10">
            <div className="w-20 h-20 mx-auto bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <Eye className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-white font-extrabold text-xl tracking-tight mb-1">No {tab}s found</p>
            <p className="text-zinc-500 text-sm font-medium">Try adjusting your search criteria.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto relative z-10 hide-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="text-left px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Name</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden sm:table-cell">Email</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Role</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filtered.map((user, index) => (
                    <motion.tr 
                      key={user._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 shadow-inner flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:from-zinc-600 transition-colors">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-extrabold text-white tracking-tight">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-zinc-400 font-medium hidden sm:table-cell">{user.email}</td>
                      <td className="px-6 py-5"><RoleBadge role={user.role} /></td>
                      <td className="px-6 py-5 text-zinc-500 font-medium hidden lg:table-cell">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max ${
                          user.isSuspended 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {user.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                          {user.isSuspended ? (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleActivate(user._id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" /> <span className="hidden xl:inline">Activate</span>
                            </motion.button>
                          ) : (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSuspend(user._id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" /> <span className="hidden xl:inline">Suspend</span>
                            </motion.button>
                          )}
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(user._id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/20 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" /> <span className="hidden xl:inline">Delete</span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          {filtered.length} user{filtered.length !== 1 ? 's' : ''} shown
        </p>
      </div>
    </div>
  );
};

export default UserManagement;
