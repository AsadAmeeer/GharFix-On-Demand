const Review = require('../models/Review');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');
const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Calculate sentiment
    const sentimentResult = sentimentAnalyzer.analyze(comment);
    let sentimentLabel = 'neutral';
    if (sentimentResult.score > 0) sentimentLabel = 'positive';
    else if (sentimentResult.score < 0) sentimentLabel = 'negative';

    const review = new Review({
      bookingId,
      customerId: req.user.id,
      workerId: booking.workerId,
      rating,
      comment,
      sentiment: sentimentLabel,
      sentimentScore: sentimentResult.score,
    });
    
    await review.save();
    
    const allReviews = await Review.find({ workerId: booking.workerId });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await WorkerProfile.findByIdAndUpdate(booking.workerProfileId, {
      averageRating: averageRating,
      totalReviews: allReviews.length,
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
