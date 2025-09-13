const redis = require('redis');

class RedisManager {
  constructor() {
    this.client = null;
    this.publisher = null;
    this.subscriber = null;
  }

  async connect() {
    try {
      // Main client for caching
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      // Publisher for pub/sub
      this.publisher = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      // Subscriber for pub/sub
      this.subscriber = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      await this.client.connect();
      await this.publisher.connect();
      await this.subscriber.connect();

      console.log('Redis connected successfully');

      // Handle errors
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.publisher.on('error', (err) => {
        console.error('Redis Publisher Error:', err);
      });

      this.subscriber.on('error', (err) => {
        console.error('Redis Subscriber Error:', err);
      });

    } catch (error) {
      console.error('Redis connection failed:', error);
      throw error;
    }
  }

  // Cache methods
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await this.client.setEx(key, ttl, serializedValue);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  // Message caching
  async cacheMessages(matchId, messages) {
    const key = `messages:${matchId}`;
    await this.set(key, messages, 3600); // 1 hour cache
  }

  async getCachedMessages(matchId) {
    const key = `messages:${matchId}`;
    return await this.get(key);
  }

  async invalidateMessageCache(matchId) {
    const key = `messages:${matchId}`;
    await this.del(key);
  }

  // User session management
  async setUserSession(userId, sessionData) {
    const key = `session:${userId}`;
    await this.set(key, sessionData, 86400); // 24 hours
  }

  async getUserSession(userId) {
    const key = `session:${userId}`;
    return await this.get(key);
  }

  async removeUserSession(userId) {
    const key = `session:${userId}`;
    await this.del(key);
  }

  // Online users tracking
  async addOnlineUser(userId, socketId) {
    const key = `online:${userId}`;
    await this.set(key, socketId, 300); // 5 minutes
  }

  async removeOnlineUser(userId) {
    const key = `online:${userId}`;
    await this.del(key);
  }

  async isUserOnline(userId) {
    const key = `online:${userId}`;
    return await this.get(key) !== null;
  }

  // Pub/Sub for cross-server communication
  async publish(channel, message) {
    try {
      await this.publisher.publish(channel, JSON.stringify(message));
    } catch (error) {
      console.error('Redis publish error:', error);
    }
  }

  async subscribe(channel, callback) {
    try {
      await this.subscriber.subscribe(channel, (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing Redis message:', error);
        }
      });
    } catch (error) {
      console.error('Redis subscribe error:', error);
    }
  }

  async disconnect() {
    if (this.client) await this.client.quit();
    if (this.publisher) await this.publisher.quit();
    if (this.subscriber) await this.subscriber.quit();
  }
}

module.exports = new RedisManager(); 