import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex relative overflow-hidden text-zinc-300">
      
      {/* Background Cinematic Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-800/20 rounded-[100%] blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zinc-900/30 rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Sidebar */}
      <div className="z-50">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {/* Optional Premium Shell wrapper around Outlet */}
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-1 min-h-[calc(100vh-12rem)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-[2.5rem]" />
              <div className="relative z-10 w-full h-full rounded-[2.25rem] overflow-hidden">
                <Outlet />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
