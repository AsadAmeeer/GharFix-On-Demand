const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharfix')
  .then(async () => {
    const email = process.argv[2];
    if (!email) {
      console.log('Please provide an email: node makeAdmin.js <email>');
      process.exit(1);
    }
    
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`Successfully made ${email} an admin!`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
