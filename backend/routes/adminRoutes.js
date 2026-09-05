const express = require('express');
const router = express.Router();
const { getAllUsers, getAllWorkers, verifyWorker, removeWorker } = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/users', authMiddleware, isAdmin, getAllUsers);
router.get('/workers', authMiddleware, isAdmin, getAllWorkers);
router.put('/workers/:id/verify', authMiddleware, isAdmin, verifyWorker);
router.delete('/workers/:id', authMiddleware, isAdmin, removeWorker);

module.exports = router;
