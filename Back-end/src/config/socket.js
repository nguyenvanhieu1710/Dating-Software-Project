const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const socketRateLimiter = require('./socketRateLimiter');
const env = require('./environment');

class SocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: env.socket.corsOrigin,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: env.socket.pingTimeout,
      pingInterval: env.socket.pingInterval,
      maxHttpBufferSize: env.socket.maxHttpBufferSize
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupRateLimiting();
  }

  async setupRateLimiting() {
    try {
      await socketRateLimiter.connect();
      
      // Set custom limits for specific events
      socketRateLimiter.setCustomLimit('send_message', 10, 60); // 10 messages per minute
      socketRateLimiter.setCustomLimit('typing_start', 30, 60); // 30 typing events per minute
      socketRateLimiter.setCustomLimit('join_match', 5, 60); // 5 room joins per minute
      
      console.log('✅ Socket rate limiting configured');
    } catch (error) {
      console.error('❌ Failed to setup rate limiting:', error);
    }
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        jwt.verify(token, env.jwt.secret, (err, decoded) => {
          if (err) {
            return next(new Error('Invalid token'));
          }
          
          socket.userId = decoded.userId;
          socket.userRole = decoded.role;
          next();
        });
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ User ${socket.userId} connected (Socket: ${socket.id})`);

      // Join user's personal room
      socket.join(`user_${socket.userId}`);

      // Handle joining match room
      socket.on('join_match', async (matchId) => {
        try {
          // Check rate limit
          const rateLimit = await socketRateLimiter.checkRateLimit(socket.id, 'join_match');
          
          if (!rateLimit.allowed) {
            socket.emit('rate_limit_exceeded', {
              event: 'join_match',
              resetTime: rateLimit.resetTime
            });
            return;
          }

          socket.leaveAll();
          socket.join(`user_${socket.userId}`);
          socket.join(`match_${matchId}`);
          socket.matchId = matchId;
          
          console.log(`✅ User ${socket.userId} joined match ${matchId}`);
          
          // Emit rate limit info
          socket.emit('rate_limit_info', {
            event: 'join_match',
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime
          });
        } catch (error) {
          console.error('Join match error:', error);
          socket.emit('error', { message: 'Failed to join match' });
        }
      });

      // Handle leaving match room
      socket.on('leave_match', () => {
        if (socket.matchId) {
          socket.leave(`match_${socket.matchId}`);
          socket.matchId = null;
          console.log(`✅ User ${socket.userId} left match`);
        }
      });

      // Handle typing indicators
      socket.on('typing_start', async (matchId) => {
        try {
          // Check rate limit
          const rateLimit = await socketRateLimiter.checkRateLimit(socket.id, 'typing_start');
          
          if (!rateLimit.allowed) {
            return; // Silently ignore if rate limited
          }

          socket.to(`match_${matchId}`).emit('user_typing', {
            userId: socket.userId,
            matchId: matchId
          });
        } catch (error) {
          console.error('Typing start error:', error);
        }
      });

      socket.on('typing_stop', (matchId) => {
        socket.to(`match_${matchId}`).emit('user_stop_typing', {
          userId: socket.userId,
          matchId: matchId
        });
      });

      // Handle online status
      socket.on('set_online_status', (status) => {
        socket.to(`user_${socket.userId}`).emit('user_status_change', {
          userId: socket.userId,
          status: status
        });
      });

      // Handle message sending
      socket.on('send_message', async (data) => {
        try {
          // Check rate limit
          const rateLimit = await socketRateLimiter.checkRateLimit(socket.id, 'send_message');
          
          if (!rateLimit.allowed) {
            socket.emit('rate_limit_exceeded', {
              event: 'send_message',
              resetTime: rateLimit.resetTime
            });
            return;
          }

          // Broadcast message to match room
          this.broadcastMessage(data.matchId, {
            ...data,
            sender_id: socket.userId,
            sent_at: new Date().toISOString()
          });

          // Emit rate limit info
          socket.emit('rate_limit_info', {
            event: 'send_message',
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime
          });
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`❌ User ${socket.userId} disconnected (Socket: ${socket.id})`);
        
        // Clean up rate limiting
        await socketRateLimiter.resetRateLimit(socket.id);
        
        // Emit offline status to all connected clients
        this.io.emit('user_offline', { userId: socket.userId });
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  // Broadcast message to match
  broadcastMessage(matchId, messageData) {
    this.io.to(`match_${matchId}`).emit('new_message', messageData);
  }

  // Send private message
  sendPrivateMessage(userId, messageData) {
    this.io.to(`user_${userId}`).emit('private_message', messageData);
  }

  // Get connected users count
  getConnectedUsers() {
    return this.io.sockets.sockets.size;
  }

  // Get users in specific match
  getUsersInMatch(matchId) {
    const room = this.io.sockets.adapter.rooms.get(`match_${matchId}`);
    return room ? room.size : 0;
  }

  // Get all connected users info
  getConnectedUsersInfo() {
    const users = [];
    this.io.sockets.sockets.forEach((socket) => {
      users.push({
        userId: socket.userId,
        socketId: socket.id,
        matchId: socket.matchId,
        connectedAt: socket.handshake.time
      });
    });
    return users;
  }

  // Get server statistics
  async getServerStats() {
    const connectedUsers = this.getConnectedUsers();
    const rooms = this.io.sockets.adapter.rooms.size;
    
    return {
      connectedUsers,
      rooms,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }

  // Graceful shutdown
  async shutdown() {
    try {
      await socketRateLimiter.disconnect();
      this.io.close();
      console.log('✅ Socket.io server shutdown complete');
    } catch (error) {
      console.error('❌ Socket.io shutdown error:', error);
    }
  }
}

module.exports = SocketManager; 