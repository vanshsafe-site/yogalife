const fs = require('fs');
const path = require('path');

// Path to login/page.tsx and signup/page.tsx
const loginPath = path.join(__dirname, 'src/app/(auth)/login/page.tsx');
const signupPath = path.join(__dirname, 'src/app/(auth)/signup/page.tsx');
const adminPath = path.join(__dirname, 'src/app/(dashboard)/admin/page.tsx');
const dashboardPath = path.join(__dirname, 'src/app/(dashboard)/dashboard/page.tsx');

// Dummy function to check if files exist without actually modifying them
// In a real scenario, you would parse and modify TypeScript code properly
function ensureFileExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`${filePath} exists.`);
    } else {
      console.log(`${filePath} does not exist.`);
    }
  } catch (err) {
    console.error(`Error checking ${filePath}:`, err);
  }
}

console.log('Prebuild script running...');
ensureFileExists(loginPath);
ensureFileExists(signupPath);
ensureFileExists(adminPath);
ensureFileExists(dashboardPath);
console.log('Prebuild checks complete.');

// Script to check environment variables before building
console.log('Checking environment variables before build...');

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI'];

// Filter missing variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`
==============================================================
  ERROR: Missing required environment variables in Vercel:
  ${missingVars.join(', ')}
==============================================================

Please set these variables in your Vercel project settings:
1. Go to https://vercel.com
2. Select your project
3. Go to Settings > Environment Variables
4. Add the missing variables

For local development, create a .env.local file with these variables.
See .env.local.example for reference.
`);

  // In CI/CD environments, we might want to exit with an error
  // But for local development, just warn
  if (process.env.VERCEL) {
    process.exit(1);
  }
} else {
  console.log('All required environment variables are set! ✅');
  
  // Output redacted values for debugging
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const redactedValue = value 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
      : 'undefined';
    console.log(`${varName}: ${redactedValue}`);
  });
} 