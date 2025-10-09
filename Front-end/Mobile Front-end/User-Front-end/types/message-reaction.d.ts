/**
 * Message Reaction Interface
 * Represents a reaction (emoji) on a message
 */
export interface IMessageReaction {
  id: number;
  message_id: number;
  user_id: number;
  reaction_type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  created_at: string;
}

/**
 * Request to create new reaction
 */
export interface CreateReactionRequest {
  reaction_type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

/**
 * Aggregated reaction summary for a message
 */
export interface MessageReactionSummary {
  reaction_type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  count: number;
  users: number[];
  has_reacted?: boolean; // Whether current user has reacted with this type
}

/**
 * Reaction with user information
 */
export interface ReactionWithUser extends IMessageReaction {
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

/**
 * Reaction event for real-time updates
 */
export interface ReactionEvent {
  type: "reaction";
  data: {
    message_id: number;
    reaction: IMessageReaction;
    action: "add" | "remove";
  };
}
