const mongoose = require('mongoose');
const User = require('./models/User');
const WorkerProfile = require('./models/WorkerProfile');
const dotenv = require('dotenv');

dotenv.config();

const workersData = [
  {
    user: {
      name: 'Muhammad Tariq',
      email: 'tariq.plumber@example.com',
      password: 'password123',
      phone: '03001234567',
      role: 'worker',
      address: { street: 'Main Boulevard, Gulberg', city: 'Lahore', pincode: '54000' }
    },
    profile: {
      profession: 'plumber',
      experience: 6,
      description: 'Expert plumber with 6 years of experience in pipe fitting, motor installations, and drainage solutions.',
      hourlyRate: 800,
      location: { city: 'Lahore', area: 'Gulberg' },
      skills: ['Pipe Fitting', 'Water Heater Repair', 'Motor Installation'],
      averageRating: 4.8,
      totalReviews: 29,
      verified: true
    }
  },
  {
    user: {
      name: 'Ali Raza',
      email: 'ali.electrician@example.com',
      password: 'password123',
      phone: '03219876543',
      role: 'worker',
      address: { street: 'Block 4, Clifton', city: 'Karachi', pincode: '75600' }
    },
    profile: {
      profession: 'electrician',
      experience: 9,
      description: 'Licensed electrician specializing in UPS installations, wiring, and appliance repair.',
      hourlyRate: 1000,
      location: { city: 'Karachi', area: 'Clifton' },
      skills: ['Wiring', 'Appliance Repair', 'UPS Installation', 'AC Service'],
      averageRating: 4.9,
      totalReviews: 52,
      verified: true
    }
  },
  {
    user: {
      name: 'Usman Ali',
      email: 'usman.carpenter@example.com',
      password: 'password123',
      phone: '03334567890',
      role: 'worker',
      address: { street: 'F-8 Markaz', city: 'Islamabad', pincode: '44000' }
    },
    profile: {
      profession: 'carpenter',
      experience: 12,
      description: 'Master carpenter for custom furniture, wardrobes, and wood repairs.',
      hourlyRate: 1200,
      location: { city: 'Islamabad', area: 'F-8' },
      skills: ['Furniture Making', 'Wood Repair', 'Cabinets', 'Doors'],
      averageRating: 4.7,
      totalReviews: 38,
      verified: true
    }
  },
  {
    user: {
      name: 'Zahid Khan',
      email: 'zahid.painter@example.com',
      password: 'password123',
      phone: '03451122334',
      role: 'worker',
      address: { street: 'Peshawar Road', city: 'Rawalpindi', pincode: '46000' }
    },
    profile: {
      profession: 'painter',
      experience: 5,
      description: 'Professional painter with expertise in interior painting, distemper, and weather shield.',
      hourlyRate: 700,
      location: { city: 'Rawalpindi', area: 'Saddar' },
      skills: ['Interior Painting', 'Exterior Painting', 'Distemper'],
      averageRating: 4.6,
      totalReviews: 21,
      verified: true
    }
  },
  {
    user: {
      name: 'Kamran Ahmed',
      email: 'kamran.mason@example.com',
      password: 'password123',
      phone: '03019988776',
      role: 'worker',
      address: { street: 'DHA Phase 5', city: 'Lahore', pincode: '54792' }
    },
    profile: {
      profession: 'mason',
      experience: 8,
      description: 'Experienced mason for brickwork, tiling, and flooring.',
      hourlyRate: 900,
      location: { city: 'Lahore', area: 'DHA' },
      skills: ['Brickwork', 'Tiling', 'Flooring', 'Plastering'],
      averageRating: 4.5,
      totalReviews: 15,
      verified: true
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharfix', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Remove old users and worker profiles
    console.log('Clearing old worker data...');
    await User.deleteMany({ role: 'worker' });
    await WorkerProfile.deleteMany();

    for (const data of workersData) {
      // Check if user already exists
      let user = await User.findOne({ email: data.user.email });
      if (!user) {
        user = new User(data.user);
        await user.save();
        console.log(`Created Pakistani worker user: ${user.name}`);
      } else {
        console.log(`User ${user.name} already exists`);
      }

      // Check if profile already exists
      let profile = await WorkerProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = new WorkerProfile({
          ...data.profile,
          userId: user._id
        });
        await profile.save();
        console.log(`Created profile for: ${user.name}`);
      } else {
        console.log(`Profile for ${user.name} already exists`);
      }
    }

    console.log('🎉 Seeding Pakistani workers completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
