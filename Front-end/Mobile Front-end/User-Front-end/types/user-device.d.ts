export interface IUserDevice {
    id: number;
    user_id: number;
    platform: string;
    device_model: string;
    app_version: string;
    last_ip: string;
    last_active_at: string;
    created_at: string;
    updated_at: string;
}