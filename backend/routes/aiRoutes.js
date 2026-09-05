const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// @route   POST /api/ai/predict-price
// @desc    Predict service price based on AI
// @access  Public
router.post('/predict-price', aiController.predictPrice);

// @route   GET /api/ai/smart-match
// @desc    Get smart-matched workers
// @access  Public
router.get('/smart-match', aiController.smartMatch);

module.exports = router;
