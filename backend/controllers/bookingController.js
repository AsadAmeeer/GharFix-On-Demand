const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');

exports.createBooking = async (req, res) => {
  try {
    const { workerId, serviceDate, serviceTime, address, description, paymentMethod } = req.body;
    
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    const booking = new Booking({
      customerId: req.user.id,
      workerId,
      workerProfileId: workerProfile._id,
      serviceDate,
      serviceTime,
      address,
      description,
      totalAmount: workerProfile.hourlyRate * 2,
      paymentMethod,
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('workerId', 'name email phone')
      .populate('workerProfileId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('workerId', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
