const express = require('express');
const router = express.Router();
const { createReview, getWorkerReviews } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
