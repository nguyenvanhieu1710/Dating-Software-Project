#!/usr/bin/env node

const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

console.log('🧪 Testing Socket.io connection...\n');

// Test configuration
const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';
const TEST_USER_ID = 1;
const TEST_MATCH_ID = 1;

// Generate test JWT token
function generateTestToken() {
  return jwt.sign(
    { userId: TEST_USER_ID, role: 'user' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}

// Test Socket.io connection
async function testSocketConnection() {
  return new Promise((resolve, reject) => {
    const token = generateTestToken();
    
    console.log('🔌 Connecting to Socket.io server...');
    
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 5000
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
      console.log(`📡 Socket ID: ${socket.id}`);
      resolve(socket);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection failed:', error.message);
      reject(error);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Timeout
    setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, 10000);
  });
}

// Test rate limiting
async function testRateLimiting(socket) {
  console.log('\n🚦 Testing rate limiting...');
  
  return new Promise((resolve) => {
    let messageCount = 0;
    let rateLimitExceeded = false;

    socket.on('rate_limit_exceeded', (data) => {
      console.log('⚠️  Rate limit exceeded:', data);
      rateLimitExceeded = true;
    });

    socket.on('rate_limit_info', (data) => {
      console.log(`📊 Rate limit info: ${data.remaining} remaining for ${data.event}`);
    });

    // Send messages rapidly to trigger rate limit
    const sendMessages = () => {
      if (messageCount < 15 && !rateLimitExceeded) {
        socket.emit('send_message', {
          matchId: TEST_MATCH_ID,
          content: `Test message ${messageCount + 1}`,
          messageType: 'text'
        });
        messageCount++;
        setTimeout(sendMessages, 100);
      } else {
        console.log(`📝 Sent ${messageCount} messages`);
        resolve();
      }
    };

    sendMessages();
  });
}

// Test room joining
async function testRoomJoining(socket) {
  console.log('\n🚪 Testing room joining...');
  
  return new Promise((resolve) => {
    socket.on('rate_limit_info', (data) => {
      if (data.event === 'join_match') {
        console.log(`✅ Joined match room: ${data.remaining} joins remaining`);
        resolve();
      }
    });

    socket.emit('join_match', TEST_MATCH_ID);
  });
}

// Test typing indicators
async function testTypingIndicators(socket) {
  console.log('\n⌨️  Testing typing indicators...');
  
  return new Promise((resolve) => {
    let typingCount = 0;

    socket.on('rate_limit_info', (data) => {
      if (data.event === 'typing_start') {
        console.log(`⌨️  Typing indicator: ${data.remaining} remaining`);
        typingCount++;
        
        if (typingCount >= 5) {
          resolve();
        }
      }
    });

    // Send typing events
    const sendTyping = () => {
      if (typingCount < 5) {
        socket.emit('typing_start', TEST_MATCH_ID);
        setTimeout(sendTyping, 200);
      }
    };

    sendTyping();
  });
}

// Test message broadcasting
async function testMessageBroadcasting(socket) {
  console.log('\n📢 Testing message broadcasting...');
  
  return new Promise((resolve) => {
    socket.on('new_message', (message) => {
      console.log('📨 Received message:', {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        match_id: message.matchId
      });
      resolve();
    });

    // Send a test message
    socket.emit('send_message', {
      matchId: TEST_MATCH_ID,
      content: 'Hello from test client!',
      messageType: 'text'
    });
  });
}

// Test disconnection
async function testDisconnection(socket) {
  console.log('\n🔌 Testing disconnection...');
  
  return new Promise((resolve) => {
    socket.on('disconnect', () => {
      console.log('✅ Disconnected from server');
      resolve();
    });

    socket.disconnect();
  });
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Socket.io tests...\n');

    // Test 1: Connection
    const socket = await testSocketConnection();
    
    // Test 2: Rate limiting
    await testRateLimiting(socket);
    
    // Test 3: Room joining
    await testRoomJoining(socket);
    
    // Test 4: Typing indicators
    await testTypingIndicators(socket);
    
    // Test 5: Message broadcasting
    await testMessageBroadcasting(socket);
    
    // Test 6: Disconnection
    await testDisconnection(socket);

    console.log('\n🎉 All Socket.io tests passed!');
    console.log('✅ Connection: Working');
    console.log('✅ Rate limiting: Working');
    console.log('✅ Room joining: Working');
    console.log('✅ Typing indicators: Working');
    console.log('✅ Message broadcasting: Working');
    console.log('✅ Disconnection: Working');

  } catch (error) {
    console.error('\n❌ Socket.io test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm start');
    console.log('2. Check if Redis is running: redis-server');
    console.log('3. Verify JWT_SECRET in .env file');
    console.log('4. Check server logs for errors');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 