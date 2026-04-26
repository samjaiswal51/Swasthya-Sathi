import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area 
} from 'recharts';

const GrowthCharts = ({ monthlyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Likes Growth - Line Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10"
      >
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-8">Likes Growth</h3>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(16,185,129,0.15)', fontWeight: 800 }}
              />
              <Line type="monotone" dataKey="likes" stroke="url(#lineGrad)" strokeWidth={5} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Appointments - Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10"
      >
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-8">Appointments Trend</h3>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
              <Tooltip 
                cursor={{ fill: '#f0fdf4' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(16,185,129,0.15)', fontWeight: 800 }}
              />
              <Bar dataKey="appointments" fill="url(#barGrad)" radius={[8, 8, 8, 8]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Profile Views - Area Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10 lg:col-span-2"
      >
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-8">Profile Views</h3>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(16,185,129,0.15)', fontWeight: 800 }}
              />
              <Area type="monotone" dataKey="profileViews" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 8, fill: '#059669', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default GrowthCharts;
