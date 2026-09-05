const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharfix')
  .then(async () => {
    const email = 'asadamer656@gmail.com';
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found.');
      process.exit(1);
    }
    
    user.password = 'admin123';
    await user.save();
    console.log(`Password reset successfully to 'admin123'`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
