import mongoose from 'mongoose';
import environment from '../config/endpoints.config';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(environment.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      connectTimeoutMS: 1000,
    });
    console.log(`connected at: ${conn.connection.host}`);
  } catch (e) {
    console.log(`unable to connect to database:\n${e.message}`);
    process.exit(1);
  }
};

export default connectDB;
