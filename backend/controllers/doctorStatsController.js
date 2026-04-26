const mongoose = require('mongoose');
const ProfileView = require('../models/ProfileView');
const HealthTip = require('../models/HealthTip');
const Appointment = require('../models/Appointment');
const Conversation = require('../models/Conversation');
const DoctorFollower = require('../models/DoctorFollower');

exports.getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { filter } = req.query; // '7days', 'thismonth', '3months', 'thisyear'

    // Calculate Date boundaries based on filter
    const now = new Date();
    let startDate = new Date(0); // All time by default
    
    if (filter === '7days') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === 'thismonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === '3months') {
      startDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (filter === 'thisyear') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const dateFilter = startDate.getTime() > 0 ? { createdAt: { $gte: startDate } } : {};
    
    // 1. Posts & Likes & Views & Saves
    const healthTips = await HealthTip.find({ doctorId, ...dateFilter });
    const postsCount = healthTips.length;
    
    let totalLikes = 0;
    let totalSaves = 0;
    let postViews = 0;
    
    healthTips.forEach(tip => {
      totalLikes += (tip.likes ? tip.likes.length : 0);
      totalSaves += (tip.saves ? tip.saves.length : 0);
      postViews += (tip.viewsCount || 0);
    });
    
    const avgLikesPerPost = postsCount > 0 ? Math.round(totalLikes / postsCount) : 0;

    // Top Posts (sorted by likes)
    const topPosts = [...healthTips]
      .sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0))
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        title: p.title,
        views: p.viewsCount || 0,
        likes: p.likes ? p.likes.length : 0,
        createdAt: p.createdAt
      }));

    // 2. Profile Views
    const profileViewsCount = await ProfileView.countDocuments({ doctorId, ...dateFilter });

    // 3. Appointments
    const appointments = await Appointment.find({ doctorId, ...dateFilter });
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.appointmentStatus === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.appointmentStatus === 'cancelled').length;
    const upcomingAppointments = appointments.filter(a => a.appointmentStatus === 'confirmed').length;

    // Find peak booking day
    const daysMap = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };
    appointments.forEach(a => {
      // a.date is usually 'YYYY-MM-DD', new Date(a.date) works
      const dateObj = new Date(a.date);
      if(!isNaN(dateObj.getTime())){
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        if(daysMap[dayStr] !== undefined) daysMap[dayStr]++;
      }
    });
    let peakDay = 'N/A';
    let maxCount = 0;
    Object.keys(daysMap).forEach(day => {
      if (daysMap[day] > maxCount) {
        maxCount = daysMap[day];
        peakDay = day;
      }
    });

    // 4. Patients
    // Unique patients from appointments
    const uniquePatientsSet = new Set();
    const repeatPatientsMap = {};
    appointments.forEach(a => {
      const pid = a.patientId.toString();
      uniquePatientsSet.add(pid);
      repeatPatientsMap[pid] = (repeatPatientsMap[pid] || 0) + 1;
    });
    const totalUniquePatients = uniquePatientsSet.size;
    const repeatPatientsCount = Object.values(repeatPatientsMap).filter(count => count > 1).length;

    // Followers Count
    const followersCount = await DoctorFollower.countDocuments({ doctorId });

    // 5. Chats
    const conversations = await Conversation.find({ participants: doctorId });
    const totalChats = conversations.length;
    const repliedChats = conversations.filter(c => c.lastSenderId && c.lastSenderId.toString() === doctorId.toString()).length;
    const responseRate = totalChats > 0 ? Math.round((repliedChats / totalChats) * 100) : 100;

    // 6. Monthly Growth Charts (always calculate for the current year or last 12 months)
    const currentYear = new Date().getFullYear();
    const monthlyGrowthMap = {
      'Jan': { likes: 0, appointments: 0, profileViews: 0 },
      'Feb': { likes: 0, appointments: 0, profileViews: 0 },
      'Mar': { likes: 0, appointments: 0, profileViews: 0 },
      'Apr': { likes: 0, appointments: 0, profileViews: 0 },
      'May': { likes: 0, appointments: 0, profileViews: 0 },
      'Jun': { likes: 0, appointments: 0, profileViews: 0 },
      'Jul': { likes: 0, appointments: 0, profileViews: 0 },
      'Aug': { likes: 0, appointments: 0, profileViews: 0 },
      'Sep': { likes: 0, appointments: 0, profileViews: 0 },
      'Oct': { likes: 0, appointments: 0, profileViews: 0 },
      'Nov': { likes: 0, appointments: 0, profileViews: 0 },
      'Dec': { likes: 0, appointments: 0, profileViews: 0 }
    };

    // Appointments Monthly
    const yearAppointments = await Appointment.find({ 
      doctorId, 
      createdAt: { $gte: new Date(currentYear, 0, 1), $lte: new Date(currentYear, 11, 31, 23, 59, 59) } 
    });
    yearAppointments.forEach(a => {
      const monthStr = new Date(a.createdAt).toLocaleString('default', { month: 'short' });
      if (monthlyGrowthMap[monthStr]) monthlyGrowthMap[monthStr].appointments++;
    });

    // Profile Views Monthly
    const yearViews = await ProfileView.find({ 
      doctorId, 
      createdAt: { $gte: new Date(currentYear, 0, 1), $lte: new Date(currentYear, 11, 31, 23, 59, 59) } 
    });
    yearViews.forEach(v => {
      const monthStr = new Date(v.createdAt).toLocaleString('default', { month: 'short' });
      if (monthlyGrowthMap[monthStr]) monthlyGrowthMap[monthStr].profileViews++;
    });

    // Likes Monthly (using HealthTips created this year - assuming likes happened closely)
    // For a highly accurate Likes graph, we'd need a PostLike model tracking createdAt. 
    // Since HealthTip just has an array of ObjectIds, we will simulate the trend based on post creation date.
    const yearPosts = await HealthTip.find({
      doctorId,
      createdAt: { $gte: new Date(currentYear, 0, 1), $lte: new Date(currentYear, 11, 31, 23, 59, 59) }
    });
    yearPosts.forEach(p => {
      const monthStr = new Date(p.createdAt).toLocaleString('default', { month: 'short' });
      if (monthlyGrowthMap[monthStr]) monthlyGrowthMap[monthStr].likes += (p.likes ? p.likes.length : 0);
    });

    const monthlyGrowth = Object.keys(monthlyGrowthMap).map(month => ({
      name: month,
      likes: monthlyGrowthMap[month].likes,
      appointments: monthlyGrowthMap[month].appointments,
      profileViews: monthlyGrowthMap[month].profileViews
    }));

    // Build Final Response
    res.json({
      overview: {
        profileViews: profileViewsCount,
        totalLikes,
        appointments: totalAppointments,
        chats: totalChats,
        posts: postsCount,
        patients: totalUniquePatients
      },
      engagement: {
        totalLikes,
        totalSaves,
        followersCount,
        avgLikesPerPost
      },
      appointmentAnalytics: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        upcomingAppointments,
        peakBookingDay: maxCount > 0 ? `${peakDay} (${maxCount})` : 'N/A'
      },
      patientStats: {
        totalUniquePatients,
        repeatPatients: repeatPatientsCount,
        newChats: totalChats - repliedChats,
        repliedChats,
        responseRate
      },
      topPosts,
      monthlyGrowth
    });

  } catch (err) {
    console.error('Doctor Stats Error:', err);
    res.status(500).json({ message: 'Server error fetching doctor stats' });
  }
};
