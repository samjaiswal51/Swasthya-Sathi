const Payment = require('../models/Payment');
const User = require('../models/User');

// PATIENT: Get all payments
exports.getPatientPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving payments' });
  }
};

// DOCTOR: Get all received payments
exports.getDoctorPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ doctorId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving payments' });
  }
};

// DOCTOR: Get earnings summary & chart data
exports.getDoctorEarningsSummary = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Calculate boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all paid payments for this doctor
    const payments = await Payment.find({ doctorId, status: 'paid' });

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let todayEarnings = 0;
    let totalAppointments = payments.length;

    // Monthly aggregation array for chart [Jan, Feb, Mar, ...]
    const monthlyDataMap = {
      'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 
      'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    };

    payments.forEach(p => {
      const amount = p.doctorNetAmount;
      totalEarnings += amount;

      const pDate = new Date(p.createdAt);
      
      if (pDate >= startOfMonth) {
        thisMonthEarnings += amount;
      }
      if (pDate >= startOfToday) {
        todayEarnings += amount;
      }

      // Add to monthly chart data if it's the current year
      if (pDate.getFullYear() === now.getFullYear()) {
        const monthName = pDate.toLocaleString('default', { month: 'short' }); // e.g. "Jan"
        if (monthlyDataMap[monthName] !== undefined) {
          monthlyDataMap[monthName] += amount;
        }
      }
    });

    const monthlyChartData = Object.keys(monthlyDataMap).map(name => ({
      name,
      earnings: monthlyDataMap[name]
    }));

    res.json({
      overview: {
        totalEarnings,
        thisMonthEarnings,
        todayEarnings,
        totalAppointments
      },
      monthlyChartData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving earnings summary' });
  }
};

// ADMIN: Get all payments
exports.getAdminPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving payments' });
  }
};

// ADMIN: Get global summary
exports.getAdminSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const payments = await Payment.find({ status: 'paid' });

    let totalRevenue = 0;
    let todayRevenue = 0;
    const doctorIds = new Set();

    payments.forEach(p => {
      totalRevenue += p.amount;
      if (new Date(p.createdAt) >= startOfToday) {
        todayRevenue += p.amount;
      }
      doctorIds.add(p.doctorId.toString());
    });

    res.json({
      totalTransactions: payments.length,
      totalRevenue,
      todayRevenue,
      activeDoctorsEarning: doctorIds.size
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving admin summary' });
  }
};
