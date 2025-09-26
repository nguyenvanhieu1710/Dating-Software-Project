export interface IUserVerification {
    id: number;
    user_id: number;
    verification_type: string;
    status: string;
    evidence_url: string;
    reviewed_by: number;
    reviewed_at: string;
    notes: string;
    created_at: string;
    updated_at: string;
}