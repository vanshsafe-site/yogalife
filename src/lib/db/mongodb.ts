import { MongoClient } from 'mongodb';

// Validate environment variable
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing from environment variables');
  throw new Error('MONGODB_URI is not defined in environment variables. Please add it to .env.local');
}

const uri = process.env.MONGODB_URI;
// Default database name
const DEFAULT_DB = 'yogalife';
// Using minimal options for better compatibility
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to maintain connection across hot-reloads
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      console.log('Creating new MongoDB client instance');
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect()
        .then(client => {
          console.log('Successfully connected to MongoDB');
          return client;
        })
        .catch(err => {
          console.error('Failed to connect to MongoDB:', err);
          throw err;
        });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .then(client => {
        console.log('Successfully connected to MongoDB');
        return client;
      })
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
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export a module-scoped MongoClient promise
export default clientPromise; 