const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, reminderController.createReminder);
router.post('/subscribe', auth, reminderController.subscribePush);
router.get('/', auth, reminderController.getReminders);
router.put('/:id', auth, reminderController.updateReminder);
router.delete('/:id', auth, reminderController.deleteReminder);
router.patch('/:id/action', auth, reminderController.recordAction);

module.exports = router;
