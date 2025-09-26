export interface IAdminUser {
    id: number;
    email: string;
    password_hash: string;
    full_name: string;
    role: string;
    is_active: boolean;
    last_login_at: string;
    created_at: string;
    updated_at: string;
    created_by: number;
}