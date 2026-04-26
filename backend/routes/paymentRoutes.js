const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payment/fake-pay
// @desc    Simulate payment processing
// @access  Private
router.post('/fake-pay', auth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    
    // Simulate processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 90% success rate simulation, or force success if a specific test card is used
    const isSuccess = Math.random() > 0.1 || req.body.forceSuccess;

    if (isSuccess) {
      const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
      return res.json({ 
        success: true, 
        message: 'Payment processed successfully',
        transactionId,
        amount
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment failed. Please try again.' 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment gateway error' });
  }
});

// History & Analytics Routes
router.get('/patient', [auth, role('patient')], paymentController.getPatientPayments);
router.get('/doctor', [auth, role('doctor')], paymentController.getDoctorPayments);
router.get('/doctor/earnings-summary', [auth, role('doctor')], paymentController.getDoctorEarningsSummary);
router.get('/admin', [auth, role('admin')], paymentController.getAdminPayments);
router.get('/admin/summary', [auth, role('admin')], paymentController.getAdminSummary);

module.exports = router;
