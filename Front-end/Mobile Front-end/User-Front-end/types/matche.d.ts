export interface IMatch {
    id: number;
    user1_id: number;
    user2_id: number;
    status: string;
    created_at: string;
    last_message_at: string;
    last_message_preview: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: string[];
}
