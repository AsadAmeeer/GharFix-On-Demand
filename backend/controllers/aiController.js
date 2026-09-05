const WorkerProfile = require('../models/WorkerProfile');
const brain = require('brain.js');

// Constants for normalization
const MAX_EXPERIENCE = 50;
const MAX_RATE = 10000; // Increased to 10k to be safe

exports.predictPrice = async (req, res) => {
  try {
    const { profession, experience, city } = req.body;

    if (!profession || experience === undefined) {
      return res.status(400).json({ message: 'Profession and experience are required.' });
    }

    // 1. Fetch all worker profiles for training
    const profiles = await WorkerProfile.find({ isAvailable: true, hourlyRate: { $gt: 0 } });

    if (profiles.length < 5) {
      // Fallback if not enough data
      return res.json({ 
        predictedRate: 1500, // default rate
        message: 'Not enough data for accurate AI prediction. Providing baseline estimate.',
        isFallback: true
      });
    }

    // 2. Prepare training data
    const trainingData = profiles.map(profile => {
      const input = {
        [`prof_${profile.profession}`]: 1,
        experience: Math.min(profile.experience / MAX_EXPERIENCE, 1),
      };
      
      if (profile.location && profile.location.city) {
        input[`city_${profile.location.city.toLowerCase()}`] = 1;
      }

      return {
        input,
        output: { rate: Math.min(profile.hourlyRate / MAX_RATE, 1) }
      };
    });

    // 3. Train the neural network
    // Using a simple NeuralNetwork configuration
    const net = new brain.NeuralNetwork({
      hiddenLayers: [4], // One hidden layer with 4 nodes
      activation: 'sigmoid'
    });

    // Train the network
    net.train(trainingData, {
      iterations: 2000,
      log: false,
    });

    // 4. Prepare prediction input
    const predictInput = {
      [`prof_${profession}`]: 1,
      experience: Math.min(Number(experience) / MAX_EXPERIENCE, 1),
    };
    if (city) {
      predictInput[`city_${city.toLowerCase()}`] = 1;
    }

    // 5. Predict
    const result = net.run(predictInput);
    
    // De-normalize
    let predictedRate = Math.round((result.rate || 0.15) * MAX_RATE);
    
    // Clamp to reasonable values based on input
    if (predictedRate < 500) predictedRate = 500;
    
    res.json({
      predictedRate,
      message: 'AI Prediction successful',
      isFallback: false
    });

  } catch (error) {
    console.error('AI Prediction error:', error);
    res.status(500).json({ message: 'Error running AI prediction', error: error.message });
  }
};

exports.smartMatch = async (req, res) => {
  try {
    const { profession, city } = req.query;

    if (!profession) {
      return res.status(400).json({ message: 'Profession is required for smart match' });
    }

    let query = { profession, isAvailable: true };
    if (city) {
      query['location.city'] = { $regex: new RegExp(city, 'i') };
    }

    const profiles = await WorkerProfile.find(query).populate('userId', 'name email');

    if (profiles.length === 0) {
      return res.json([]);
    }

    // Calculate max reviews for normalization
    const maxReviews = Math.max(...profiles.map(p => p.totalReviews || 0), 1);
    
    // Calculate smart match score
    const matchedProfiles = profiles.map(profile => {
      const normalizedRating = (profile.averageRating || 0) / 5;
      const normalizedExp = Math.min((profile.experience || 0) / MAX_EXPERIENCE, 1);
      const normalizedReviews = (profile.totalReviews || 0) / maxReviews;

      // Weighting: 50% rating, 30% experience, 20% review volume
      const matchScore = Math.round((normalizedRating * 0.5 + normalizedExp * 0.3 + normalizedReviews * 0.2) * 100);

      return {
        ...profile.toObject(),
        matchScore
      };
    });

    // Sort by match score descending
    matchedProfiles.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedProfiles);
  } catch (error) {
    console.error('AI Smart Match error:', error);
    res.status(500).json({ message: 'Error running AI Smart Match', error: error.message });
  }
};
