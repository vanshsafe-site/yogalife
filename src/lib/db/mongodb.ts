import { MongoClient } from 'mongodb';

// Verify environment variable exists and log diagnostic information
if (!process.env.MONGODB_URI) {
  console.error('Environment variables:', Object.keys(process.env).filter(key => !key.startsWith('npm_')));
  throw new Error('MONGODB_URI is not defined in environment variables. Please add it to .env.local');
}

// Debug log - remove in production
console.log('MongoDB URI found with length:', process.env.MONGODB_URI.length);

const uri = process.env.MONGODB_URI;
// Default database name if not specified in URI
const DEFAULT_DB = 'yogalife';
const options = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
};

let client;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect()
        .catch(err => {
          console.error('Failed to connect to MongoDB:', err);
          throw err;
        });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
} catch (error) {
  console.error('Error initializing MongoDB connection:', error);
  throw error;
}

// Helper function to get database with default name
export const getDb = async (dbName = DEFAULT_DB) => {
  const client = await clientPromise;
  return client.db(dbName);
};

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 