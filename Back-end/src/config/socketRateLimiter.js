const redis = require('redis');

class SocketRateLimiter {
  constructor() {
    this.client = null;
    this.defaultLimit = 20; // 20 events per window
    this.defaultWindow = 60; // 60 seconds window
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      await this.client.connect();
      console.log('✅ Socket Rate Limiter Redis connected');
    } catch (error) {
      console.error('❌ Socket Rate Limiter Redis connection failed:', error);
      throw error;
    }
  }

  /**
   * Check if user has exceeded rate limit
   */
  async checkRateLimit(socketId, eventType = 'default') {
    try {
      const key = `rate_limit:${socketId}:${eventType}`;
      const current = await this.client.get(key);
      
      if (current && parseInt(current) >= this.defaultLimit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: await this.getResetTime(key)
        };
      }

      // Increment counter
      const multi = this.client.multi();
      multi.incr(key);
      multi.expire(key, this.defaultWindow);
      
      const results = await multi.exec();
      const newCount = results[0];

      return {
        allowed: true,
        remaining: Math.max(0, this.defaultLimit - newCount),
        resetTime: await this.getResetTime(key)
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Allow if Redis fails
      return { allowed: true, remaining: this.defaultLimit, resetTime: Date.now() + this.defaultWindow * 1000 };
    }
  }

  /**
   * Get reset time for rate limit key
   */
  async getResetTime(key) {
    try {
      const ttl = await this.client.ttl(key);
      return Date.now() + (ttl * 1000);
    } catch (error) {
      return Date.now() + (this.defaultWindow * 1000);
    }
  }

  /**
   * Reset rate limit for a user
   */
  async resetRateLimit(socketId, eventType = 'default') {
    try {
      const key = `rate_limit:${socketId}:${eventType}`;
      await this.client.del(key);
    } catch (error) {
      console.error('Reset rate limit failed:', error);
    }
  }

  /**
   * Get rate limit info for a user
   */
  async getRateLimitInfo(socketId, eventType = 'default') {
    try {
      const key = `rate_limit:${socketId}:${eventType}`;
      const current = await this.client.get(key);
      const ttl = await this.client.ttl(key);
      
      return {
        current: parseInt(current) || 0,
        limit: this.defaultLimit,
        remaining: Math.max(0, this.defaultLimit - (parseInt(current) || 0)),
        resetTime: Date.now() + (ttl * 1000),
        window: this.defaultWindow
      };
    } catch (error) {
      console.error('Get rate limit info failed:', error);
      return {
        current: 0,
        limit: this.defaultLimit,
        remaining: this.defaultLimit,
        resetTime: Date.now() + (this.defaultWindow * 1000),
        window: this.defaultWindow
      };
    }
  }

  /**
   * Set custom limits for specific events
   */
  setCustomLimit(eventType, limit, window) {
    this.customLimits = this.customLimits || {};
    this.customLimits[eventType] = { limit, window };
  }

  /**
   * Get limit for specific event type
   */
  getLimit(eventType) {
    if (this.customLimits && this.customLimits[eventType]) {
      return this.customLimits[eventType];
    }
    return { limit: this.defaultLimit, window: this.defaultWindow };
  }

  /**
   * Disconnect Redis client
   */
  async disconnect() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

module.exports = new SocketRateLimiter(); 