export interface IPayment {
    id: number;
    user_id: number;
    subscription_id: number;
    consumable_type: string;
    quantity: number;
    amount: number;
    currency: string;
    payment_method: string;
    transaction_id: string;
    provider_response: string;
    status: string;
    consumable_status: string;
    expiry_date: string;
    platform: string;
    is_recurring: boolean;
    next_billing_date: string;
    created_at: string;
    updated_at: string;
}