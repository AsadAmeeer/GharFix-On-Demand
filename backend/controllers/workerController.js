const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.createWorkerProfile = async (req, res) => {
  try {
    const { profession, experience, description, hourlyRate, location, skills } = req.body;
    
    const existingProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Worker profile already exists' });
    }
    
    const workerProfile = new WorkerProfile({
      userId: req.user.id,
      profession,
      experience,
      description,
      hourlyRate,
      location,
      skills: skills || [],
    });
    
    await workerProfile.save();
    await User.findByIdAndUpdate(req.user.id, { role: 'worker' });
    
    res.status(201).json(workerProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkerProfile = async (req, res) => {
  try {
    const worker = await WorkerProfile.findOne({ userId: req.params.id }).populate('userId', 'name email phone');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const { profession, city, minRate, maxRate } = req.query;
    let filter = {}; // Removed verified: true so unverified workers also show up
    
    if (profession) filter.profession = profession;
    if (city) filter['location.city'] = city;
    
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }
    
    const workers = await WorkerProfile.find(filter).populate('userId', 'name email phone');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const workerProfile = await WorkerProfile.findOne({ userId: req.user.id });
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    workerProfile.isAvailable = isAvailable;
    await workerProfile.save();
    res.json(workerProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.user.id })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
