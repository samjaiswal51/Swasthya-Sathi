import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Heart, AlertCircle, Bell } from 'lucide-react';

const FamilyDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center rounded-b-3xl mb-8 mx-4 mt-2">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-100 p-2 rounded-full">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Family Overview</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-rose-500 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-600 font-medium transition-colors"
          >
            <span>Logout</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-rose-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-100 rounded-full opacity-50"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Monitored Family Members</h2>
          
          <div className="space-y-4 relative z-10">
            {/* Family Member Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  GM
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Grandma Mary</h3>
                  <p className="text-sm text-gray-500">Last updated: 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Heart Rate</div>
                  <div className="text-sm text-green-600 font-semibold">Normal (72 bpm)</div>
                </div>
                <button className="text-rose-600 font-medium hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>

            {/* Another Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-lg">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe (Son)</h3>
                  <p className="text-sm text-gray-500">Last updated: 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Next Appt</div>
                  <div className="text-sm text-amber-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Tomorrow
                  </div>
                </div>
                <button className="text-rose-600 font-medium hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FamilyDashboard;
