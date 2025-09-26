export interface ISubscription {
    id: number;
    user_id: number;
    plan_type: string;
    status: string;
    billing_cycle: string;
    start_date: string;
    end_date: string;
    next_billing_date: string;
    price: number;
    currency: string;
    payment_method: string;
    auto_renew: boolean;
    trial_period: boolean;
    trial_end_date: string;
    discount_applied: number;
    promo_code: string;
    platform: string;
    transaction_id: string;
    last_payment_date: string;
    failed_payments: number;
    cancelled_at: string;
    cancellation_reason: string;
    refund_status: string;
    refund_amount: number;
    created_at: string;
    updated_at: string;
}