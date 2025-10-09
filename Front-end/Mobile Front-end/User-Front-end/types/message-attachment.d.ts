/**
 * Message Attachment Interface
 * Represents a file attachment in a message
 */
export interface IMessageAttachment {
  id: number;
  message_id: number;
  file_url: string;
  file_type: "image" | "video" | "audio" | "document" | "other";
  metadata: AttachmentMetadata | null;
  created_at: string;
}

/**
 * Attachment metadata with file details
 */
export interface AttachmentMetadata {
  file_name?: string;
  file_size?: number; // in bytes
  mime_type?: string;
  duration?: number; // For audio/video in seconds
  width?: number; // For images/videos
  height?: number; // For images/videos
  thumbnail_url?: string;
}

/**
 * Request to create new attachment
 */
export interface CreateAttachmentRequest {
  file_url: string;
  file_type: "image" | "video" | "audio" | "document" | "other";
  metadata?: AttachmentMetadata;
}

/**
 * Attachment with additional display info
 */
export interface FormattedAttachment extends IMessageAttachment {
  file_size_formatted?: string;
  duration_formatted?: string;
  file_extension?: string;
  is_image?: boolean;
  is_video?: boolean;
  is_audio?: boolean;
  is_document?: boolean;
}
