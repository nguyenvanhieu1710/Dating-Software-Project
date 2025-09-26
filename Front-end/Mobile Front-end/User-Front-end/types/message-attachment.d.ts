export interface IMessageAttachment {
    id: number;
    message_id: number;
    file_url: string;
    file_type: string;
    metadata: any;
    created_at: string;
}