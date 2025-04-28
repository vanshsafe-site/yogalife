// Simple script to check if environment variables are loaded
require('dotenv').config({ path: '.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET); 