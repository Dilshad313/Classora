import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔗 Attempting MongoDB connection...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    console.log('💡 Please check:');
    console.log('   - MONGODB_URI in .env file');
    console.log('   - MongoDB server is running');
    console.log('   - Network connectivity');
    process.exit(1);
  }
};

export default connectDB;