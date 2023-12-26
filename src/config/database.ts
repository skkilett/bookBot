import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    const dbUri = process.env.MONGODB_URI as string;
    await mongoose.connect(dbUri);
    console.log('Trying to connect to the database...');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); 
  }
};

export default connectToDatabase;
