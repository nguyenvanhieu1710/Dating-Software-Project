export interface IMessage {
    id: number;
    match_id: number;
    sender_id: number;
    content: string;
    message_type: string;
    sent_at: string;
    read_at: string;
    deleted_at: string;
    is_pinned: boolean;
    pinned_at: string;
    reply_to_message_id: number;
    edited_at: string;
}