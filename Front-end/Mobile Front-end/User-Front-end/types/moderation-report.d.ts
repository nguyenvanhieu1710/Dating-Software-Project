export interface IModerationReport {
    id: number;
    reporter_id: number;
    reported_user_id: number;
    reported_content_id: number;
    content_type: string;
    reason: string;
    description: string;
    status: string;
    priority: string;
    admin_notes: string;
    resolved_by: number;
    resolved_at: string;
    created_at: string;
    updated_at: string;
}