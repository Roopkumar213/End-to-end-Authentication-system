// db.js
// MongoDB connection helper using mongoose.
// Usage: const connectDB = require('./config/db'); await connectDB();

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  // Connection options tuned for modern mongoose
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // autoIndex: false, // set to false in production if you create indexes manually
    // reconnectTries and reconnectInterval removed in newer drivers; handled automatically
  };

  try {
    await mongoose.connect(uri, opts);

    mongoose.connection.on('connected', () => {
      console.log(`Mongoose connected to ${uri}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected');
    });

    // Optional: handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close(false);
      console.log('Mongoose connection closed through app termination (SIGINT)');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
};

module.exports = connectDB;
