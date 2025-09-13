#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up environment for Dating Software Backend...\n');

// Function to generate random string
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to generate JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Function to check if .env file exists
function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  return fs.existsSync(envPath);
}

// Function to create .env file from template
function createEnvFile() {
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ env.example file not found!');
    process.exit(1);
  }

  let envContent = fs.readFileSync(envExamplePath, 'utf8');

  // Generate secrets
  const jwtSecret = generateJWTSecret();
  const jwtRefreshSecret = generateJWTSecret();

  // Replace placeholder values
  envContent = envContent.replace(/your_super_secret_jwt_key_here_make_it_long_and_random/g, jwtSecret);
  envContent = envContent.replace(/your_refresh_token_secret_here/g, jwtRefreshSecret);
  envContent = envContent.replace(/your_password_here/g, 'your_actual_password_here');

  // Write .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file from template');
}

// Function to validate environment
function validateEnvironment() {
  const env = require('../src/config/environment');
  
  console.log('\n📋 Environment Summary:');
  console.log('========================');
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Server: http://${env.HOST}:${env.PORT}`);
  console.log(`🗄️  Database: ${env.database.host}:${env.database.port}/${env.database.name}`);
  console.log(`🔴 Redis: ${env.redis.host}:${env.redis.port}`);
  console.log(`📡 Socket.io: ${env.socket.corsOrigin}`);
  console.log(`🌐 Frontend: ${env.frontend.url}`);
  console.log(`📱 Mobile: ${env.frontend.mobileUrl}`);
  
  // Check required variables
  const required = ['JWT_SECRET', 'DB_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.log('\n⚠️  Missing required environment variables:');
    missing.forEach(key => console.log(`   - ${key}`));
    console.log('\nPlease update your .env file with the missing values.');
    return false;
  }
  
  console.log('\n✅ Environment validation passed!');
  return true;
}

// Function to create necessary directories
function createDirectories() {
  const dirs = [
    'uploads',
    'uploads/temp',
    'logs',
    'database/migrations'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

// Function to check dependencies
function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    'socket.io',
    'redis',
    'express',
    'pg',
    'jsonwebtoken',
    'bcryptjs',
    'express-rate-limit'
  ];

  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('\n⚠️  Missing dependencies:');
    missingDeps.forEach(dep => console.log(`   - ${dep}`));
    console.log('\nPlease run: npm install');
    return false;
  }

  console.log('✅ All required dependencies are installed');
  return true;
}

// Function to provide setup instructions
function showInstructions() {
  console.log('\n📝 Setup Instructions:');
  console.log('=====================');
  console.log('1. Update your .env file with actual values:');
  console.log('   - DB_PASSWORD: Your PostgreSQL password');
  console.log('   - EMAIL_USER: Your email for notifications');
  console.log('   - EMAIL_PASSWORD: Your email app password');
  console.log('   - FIREBASE_*: Your Firebase project credentials');
  console.log('');
  console.log('2. Install dependencies:');
  console.log('   npm install');
  console.log('');
  console.log('3. Setup database:');
  console.log('   - Create PostgreSQL database: dating_software');
  console.log('   - Run migrations: npm run migrate');
  console.log('');
  console.log('4. Setup Redis:');
  console.log('   - Install Redis server');
  console.log('   - Start Redis: redis-server');
  console.log('');
  console.log('5. Start the server:');
  console.log('   npm start');
  console.log('');
  console.log('6. Test the API:');
  console.log('   curl http://localhost:5000/health');
  console.log('');
  console.log('7. Test Socket.io:');
  console.log('   npm run socket:test');
  console.log('');
}

// Main setup function
async function setup() {
  try {
    console.log('🔍 Checking current setup...\n');

    // Check if .env exists
    if (!checkEnvFile()) {
      console.log('📝 Creating .env file...');
      createEnvFile();
    } else {
      console.log('✅ .env file already exists');
    }

    // Create directories
    console.log('\n📁 Creating necessary directories...');
    createDirectories();

    // Check dependencies
    console.log('\n📦 Checking dependencies...');
    if (!checkDependencies()) {
      process.exit(1);
    }

    // Validate environment
    console.log('\n🔍 Validating environment...');
    validateEnvironment();

    // Show instructions
    showInstructions();

    console.log('🎉 Setup completed successfully!');
    console.log('🚀 You can now start the server with: npm start');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup, validateEnvironment }; 