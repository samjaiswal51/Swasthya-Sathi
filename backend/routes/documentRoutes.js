const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10000000 } // 10MB limit
}); 

router.post('/', auth, upload.single('document'), documentController.uploadDocument);
router.get('/', auth, documentController.getDocuments);
router.get('/:id', auth, documentController.getDocumentById);
router.get('/:id/view', auth, documentController.viewDocument);
router.get('/:id/download', auth, documentController.downloadDocument);
router.put('/:id', auth, documentController.updateDocument);
router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;
