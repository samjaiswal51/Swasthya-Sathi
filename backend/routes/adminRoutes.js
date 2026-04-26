const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const guard = [auth, role('admin')];

// ── Dashboard Stats ───────────────────────────────────
router.get('/dashboard-stats', guard, admin.getDashboardStats);

// ── Doctor Verification ───────────────────────────────
router.get('/doctors/pending',     guard, admin.getPendingDoctors);
router.get('/doctors/all',         guard, admin.getAllDoctorProfiles);
router.patch('/doctor/:id/approve', guard, admin.approveDoctor);
router.patch('/doctor/:id/reject',  guard, admin.rejectDoctor);

// ── User Management ───────────────────────────────────
router.get('/users',               guard, admin.getUsers);
router.patch('/user/:id/suspend',  guard, admin.suspendUser);
router.patch('/user/:id/activate', guard, admin.activateUser);
router.delete('/delete/:id',       guard, admin.deleteUser);

// ── Analytics & Payments ──────────────────────────────
router.get('/analytics',           guard, admin.getAnalytics);
router.get('/payments',            guard, admin.getPayments);

// ── Complaints ────────────────────────────────────────
router.get('/complaints',                    guard, admin.getComplaints);
router.patch('/complaint/:id/resolve',       guard, admin.resolveComplaint);
router.delete('/complaint/:id',              guard, admin.deleteComplaint);

module.exports = router;
