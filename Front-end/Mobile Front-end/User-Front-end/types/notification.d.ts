export interface INotification {
    id: number;
    user_id: number;
    title: string;
    body: string;
    data: any;
    sent_at: string;
    read_at: string;
    created_at: string;
}