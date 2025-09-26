export interface IPhoto {
    id: number;
    user_id: number;
    url: string;
    order_index: number;
    is_public: boolean;
    created_at: string;
}