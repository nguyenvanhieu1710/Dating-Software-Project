export interface IModerationAction {
    id: number;
    report_id: number;
    action: string;
    action_details: string;
    status: string;
    assigned_to: number;
    completed_at: string;
    error_message: string;
    created_at: string;
    created_by: number;
}