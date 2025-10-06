export interface IProfile {
    user_id: number;
    first_name: string;
    dob: string;
    gender: 'male' | 'female' | 'other';
    bio?: string;
    job_title?: string;
    company?: string;
    school?: string;
    education?: string;
    height_cm?: number;
    relationship_goals?: string;
    location?: string;
    popularity_score?: number;
    message_count?: number;
    last_active_at?: string;
    is_verified?: boolean;
    is_online?: boolean;
    last_seen?: string | null;
    created_at?: string;
    updated_at?: string;
}