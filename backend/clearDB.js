const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clearDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');
    
    console.log('Dropping the entire database to start fresh...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully!');
    
    console.log('Disconnecting...');
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDB();
