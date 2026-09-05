const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find()
      .populate('userId', 'name email phone role')
      .sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyWorker = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findById(req.params.id);
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    
    workerProfile.verified = true;
    await workerProfile.save();
    
    res.json({ message: 'Worker verified successfully', workerProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeWorker = async (req, res) => {
  try {
    const workerProfile = await WorkerProfile.findById(req.params.id);
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    
    // Change user role back to customer
    await User.findByIdAndUpdate(workerProfile.userId, { role: 'customer' });
    
    // Delete worker profile
    await WorkerProfile.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Worker removed successfully and demoted to customer.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
