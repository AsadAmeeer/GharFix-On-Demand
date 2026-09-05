const mongoose = require('mongoose');
const User = require('./models/User');
const WorkerProfile = require('./models/WorkerProfile');

mongoose.connect('mongodb://localhost:27017/gharfix')
  .then(async () => {
    console.log('Connected to DB');
    const users = await User.find({ role: 'worker' });
    console.log('Worker Users:', users.length);
    const profiles = await WorkerProfile.find();
    console.log('Worker Profiles:', profiles.length);
    console.log(profiles);
    process.exit(0);
  });
