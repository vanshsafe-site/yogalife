import { MongoClient } from 'mongodb';

// Verify environment variable exists and log diagnostic information
if (!process.env.MONGODB_URI) {
  console.error('Environment variables:', Object.keys(process.env).filter(key => !key.startsWith('npm_')));
  throw new Error('MONGODB_URI is not defined in environment variables. Please add it to .env.local');
}

// Debug log - remove in production
console.log('MongoDB URI found with length:', process.env.MONGODB_URI.length);
console.log('Attempting to connect to MongoDB...');

const uri = process.env.MONGODB_URI;
// Default database name if not specified in URI
const DEFAULT_DB = 'yogalife';
// Using minimal options for better compatibility
const options = {};

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
      console.log('Creating new MongoDB client instance in development mode');
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect()
        .then(client => {
          console.log('Successfully connected to MongoDB');
          return client;
        })
        .catch(err => {
          console.error('Failed to connect to MongoDB:', err);
          console.error('Error details:', JSON.stringify(err, null, 2));
          throw err;
        });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    console.log('Creating new MongoDB client instance in production mode');
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .then(client => {
        console.log('Successfully connected to MongoDB');
        return client;
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        throw err;
      });
  }
} catch (error) {
  console.error('Error initializing MongoDB connection:', error);
  console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
  throw error;
}

// Helper function to get database with default name
export const getDb = async (dbName = DEFAULT_DB) => {
  try {
    const client = await clientPromise;
    console.log(`Getting database: ${dbName}`);
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    throw error;
  }
};

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 