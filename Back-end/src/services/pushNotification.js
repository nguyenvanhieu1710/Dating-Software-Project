const admin = require('firebase-admin');
const redisManager = require('../config/redis');

class PushNotificationService {
  constructor() {
    this.initializeFirebase();
  }

  initializeFirebase() {
    try {
      // Initialize Firebase Admin SDK
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }

  /**
   * Send push notification to specific user
   */
  async sendToUser(userId, notification) {
    try {
      // Get user's FCM token from Redis
      const fcmToken = await redisManager.get(`fcm_token:${userId}`);
      
      if (!fcmToken) {
        console.log(`No FCM token found for user ${userId}`);
        return false;
      }

      const message = {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          ...notification.data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'chat_messages',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.body,
              },
              badge: 1,
              sound: 'default',
              category: 'chat_message',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent notification:', response);
      return true;

    } catch (error) {
      console.error('Failed to send push notification:', error);
      
      // Handle invalid token
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        await this.removeInvalidToken(userId);
      }
      
      return false;
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToMultipleUsers(userIds, notification) {
    try {
      const tokens = [];
      const validUserIds = [];

      // Get FCM tokens for all users
      for (const userId of userIds) {
        const token = await redisManager.get(`fcm_token:${userId}`);
        if (token) {
          tokens.push(token);
          validUserIds.push(userId);
        }
      }

      if (tokens.length === 0) {
        console.log('No valid FCM tokens found');
        return false;
      }

      const message = {
        tokens: tokens,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          ...notification.data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'chat_messages',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.body,
              },
              badge: 1,
              sound: 'default',
              category: 'chat_message',
            },
          },
        },
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent notifications:', response);

      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = response.responses
          .map((resp, idx) => !resp.success ? validUserIds[idx] : null)
          .filter(Boolean);

        for (const userId of failedTokens) {
          await this.removeInvalidToken(userId);
        }
      }

      return response.successCount > 0;

    } catch (error) {
      console.error('Failed to send multicast notification:', error);
      return false;
    }
  }

  /**
   * Send notification to topic subscribers
   */
  async sendToTopic(topic, notification) {
    try {
      const message = {
        topic: topic,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          ...notification.data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'chat_messages',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.body,
              },
              badge: 1,
              sound: 'default',
              category: 'chat_message',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent topic notification:', response);
      return true;

    } catch (error) {
      console.error('Failed to send topic notification:', error);
      return false;
    }
  }

  /**
   * Send chat message notification
   */
  async sendChatNotification(senderId, receiverId, messageData) {
    try {
      // Get sender profile
      const senderProfile = await this.getSenderProfile(senderId);
      
      const notification = {
        title: senderProfile.first_name,
        body: this.truncateMessage(messageData.content),
        data: {
          type: 'chat_message',
          match_id: messageData.match_id.toString(),
          message_id: messageData.id.toString(),
          sender_id: senderId.toString(),
        },
      };

      return await this.sendToUser(receiverId, notification);

    } catch (error) {
      console.error('Failed to send chat notification:', error);
      return false;
    }
  }

  /**
   * Send match notification
   */
  async sendMatchNotification(userId, matchData) {
    try {
      const notification = {
        title: 'New Match! 💕',
        body: `You have a new match with ${matchData.other_user.first_name}!`,
        data: {
          type: 'new_match',
          match_id: matchData.id.toString(),
          other_user_id: matchData.other_user.id.toString(),
        },
      };

      return await this.sendToUser(userId, notification);

    } catch (error) {
      console.error('Failed to send match notification:', error);
      return false;
    }
  }

  /**
   * Send like notification
   */
  async sendLikeNotification(userId, likerData) {
    try {
      const notification = {
        title: 'New Like! ❤️',
        body: `${likerData.first_name} liked your profile!`,
        data: {
          type: 'new_like',
          liker_id: likerData.id.toString(),
        },
      };

      return await this.sendToUser(userId, notification);

    } catch (error) {
      console.error('Failed to send like notification:', error);
      return false;
    }
  }

  /**
   * Store FCM token for user
   */
  async storeUserToken(userId, token) {
    try {
      await redisManager.set(`fcm_token:${userId}`, token, 86400 * 30); // 30 days
      console.log(`Stored FCM token for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to store FCM token:', error);
      return false;
    }
  }

  /**
   * Remove invalid FCM token
   */
  async removeInvalidToken(userId) {
    try {
      await redisManager.del(`fcm_token:${userId}`);
      console.log(`Removed invalid FCM token for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to remove FCM token:', error);
      return false;
    }
  }

  /**
   * Subscribe user to topic
   */
  async subscribeToTopic(token, topic) {
    try {
      const response = await admin.messaging().subscribeToTopic(token, topic);
      console.log(`Successfully subscribed to topic ${topic}`);
      return response.successCount > 0;
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
      return false;
    }
  }

  /**
   * Unsubscribe user from topic
   */
  async unsubscribeFromTopic(token, topic) {
    try {
      const response = await admin.messaging().unsubscribeFromTopic(token, topic);
      console.log(`Successfully unsubscribed from topic ${topic}`);
      return response.successCount > 0;
    } catch (error) {
      console.error('Failed to unsubscribe from topic:', error);
      return false;
    }
  }

  /**
   * Get sender profile from database
   */
  async getSenderProfile(userId) {
    const sql = `
      SELECT first_name, last_name 
      FROM profiles 
      WHERE user_id = $1
    `;
    const DatabaseHelper = require('../config/database/queryHelper');
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Truncate message for notification
   */
  truncateMessage(content, maxLength = 100) {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Send notification with custom sound
   */
  async sendWithCustomSound(userId, notification, soundFile) {
    try {
      const fcmToken = await redisManager.get(`fcm_token:${userId}`);
      
      if (!fcmToken) {
        return false;
      }

      const message = {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          ...notification.data,
          sound: soundFile,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'chat_messages',
            priority: 'high',
            sound: soundFile,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.body,
              },
              badge: 1,
              sound: soundFile,
              category: 'chat_message',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent notification with custom sound:', response);
      return true;

    } catch (error) {
      console.error('Failed to send notification with custom sound:', error);
      return false;
    }
  }
}

module.exports = new PushNotificationService(); 