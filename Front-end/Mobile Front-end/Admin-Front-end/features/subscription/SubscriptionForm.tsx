import * as React from "react";
import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { Button, useTheme } from "react-native-paper";
import DateTimeField from "@/components/inputs/DatePickerField";
import TextField from "@/components/inputs/TextField";
import { ISubscription } from "@/types/subscription";
import { adminSubscriptionService } from "@/services/admin-subscription.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook cho form state management
const useSubscriptionForm = (initialData: ISubscription | null) => {
  const [userId, setUserId] = React.useState(
    initialData?.user_id?.toString() ?? ""
  );
  const [planType, setPlanType] = React.useState(initialData?.plan_type ?? "");
  const [status, setStatus] = React.useState(initialData?.status ?? "active");
  const [billingCycle, setBillingCycle] = React.useState(
    initialData?.billing_cycle ?? "monthly"
  );
  const [startDate, setStartDate] = React.useState(
    initialData?.start_date ? new Date(initialData.start_date) : new Date()
  );
  const [endDate, setEndDate] = React.useState(
    initialData?.end_date ? new Date(initialData.end_date) : null
  );
  const [nextBillingDate, setNextBillingDate] = React.useState(
    initialData?.next_billing_date
      ? new Date(initialData.next_billing_date)
      : null
  );
  const [price, setPrice] = React.useState(
    initialData?.price?.toString() ?? "0"
  );
  const [currency, setCurrency] = React.useState(
    initialData?.currency ?? "USD"
  );
  const [paymentMethod, setPaymentMethod] = React.useState(
    initialData?.payment_method ?? ""
  );
  const [autoRenew, setAutoRenew] = React.useState(
    initialData?.auto_renew ?? true
  );
  const [trialPeriod, setTrialPeriod] = React.useState(
    initialData?.trial_period ?? false
  );
  const [trialEndDate, setTrialEndDate] = React.useState(
    initialData?.trial_end_date ? new Date(initialData.trial_end_date) : null
  );
  const [discountApplied, setDiscountApplied] = React.useState(
    initialData?.discount_applied?.toString() ?? "0"
  );
  const [promoCode, setPromoCode] = React.useState(
    initialData?.promo_code ?? ""
  );
  const [platform, setPlatform] = React.useState(initialData?.platform ?? "");
  const [transactionId, setTransactionId] = React.useState(
    initialData?.transaction_id ?? ""
  );
  const [lastPaymentDate, setLastPaymentDate] = React.useState(
    initialData?.last_payment_date
      ? new Date(initialData.last_payment_date)
      : null
  );
  const [failedPayments, setFailedPayments] = React.useState(
    initialData?.failed_payments?.toString() ?? "0"
  );
  const [cancelledAt, setCancelledAt] = React.useState(
    initialData?.cancelled_at ? new Date(initialData.cancelled_at) : null
  );
  const [cancellationReason, setCancellationReason] = React.useState(
    initialData?.cancellation_reason ?? ""
  );
  const [refundStatus, setRefundStatus] = React.useState(
    initialData?.refund_status ?? ""
  );
  const [refundAmount, setRefundAmount] = React.useState(
    initialData?.refund_amount?.toString() ?? "0"
  );

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const validationErrors = adminSubscriptionService.validateSubscriptionData(
      getFormData()
    );
    return validationErrors;
  };

  const getFormData = (): ISubscription => ({
    id: initialData?.id ?? 0, // For update
    user_id: Number(userId),
    plan_type: planType,
    status: status,
    billing_cycle: billingCycle,
    start_date: startDate.toISOString(),
    end_date: endDate?.toISOString() ?? "",
    next_billing_date: nextBillingDate?.toISOString() ?? "",
    price: Number(price),
    currency: currency,
    payment_method: paymentMethod,
    auto_renew: autoRenew,
    trial_period: trialPeriod,
    trial_end_date: trialEndDate?.toISOString() ?? "",
    discount_applied: Number(discountApplied),
    promo_code: promoCode,
    platform: platform,
    transaction_id: transactionId,
    last_payment_date: lastPaymentDate?.toISOString() ?? "",
    failed_payments: Number(failedPayments),
    cancelled_at: cancelledAt?.toISOString() ?? "",
    cancellation_reason: cancellationReason,
    refund_status: refundStatus,
    refund_amount: Number(refundAmount),
    created_at: initialData?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    formState: {
      userId,
      planType,
      status,
      billingCycle,
      startDate,
      endDate,
      nextBillingDate,
      price,
      currency,
      paymentMethod,
      autoRenew,
      trialPeriod,
      trialEndDate,
      discountApplied,
      promoCode,
      platform,
      transactionId,
      lastPaymentDate,
      failedPayments,
      cancelledAt,
      cancellationReason,
      refundStatus,
      refundAmount,
    },
    setters: {
      setUserId,
      setPlanType,
      setStatus,
      setBillingCycle,
      setStartDate,
      setEndDate,
      setNextBillingDate,
      setPrice,
      setCurrency,
      setPaymentMethod,
      setAutoRenew,
      setTrialPeriod,
      setTrialEndDate,
      setDiscountApplied,
      setPromoCode,
      setPlatform,
      setTransactionId,
      setLastPaymentDate,
      setFailedPayments,
      setCancelledAt,
      setCancellationReason,
      setRefundStatus,
      setRefundAmount,
    },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: ISubscription | null;
  onSubmit: (subscription: ISubscription) => void;
  onCancel: () => void;
};

export default function SubscriptionForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const theme = useTheme();
  const { formState, setters, validateForm, getFormData } =
    useSubscriptionForm(initialData);

  // Collapse states - tách riêng để dễ quản lý
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    billing: true,
    dates: false,
    payment: false,
    cancellation: false,
    options: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      // Có thể show toast/alert ở đây
      return;
    }

    const subscriptionData = getFormData();
    onSubmit(subscriptionData);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 120,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <CollapsibleSection
          title="Basic Information"
          subtitle="User ID, plan type and status"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="User ID"
            value={formState.userId}
            onChangeText={setters.setUserId}
            keyboardType="numeric"
            placeholder="Enter user ID"
          />
          <TextField
            label="Plan Type"
            value={formState.planType}
            onChangeText={setters.setPlanType}
            placeholder="e.g., premium"
          />
          <TextField
            label="Status"
            value={formState.status}
            onChangeText={setters.setStatus}
            placeholder="e.g., active"
          />
        </CollapsibleSection>

        {/* Billing Details */}
        <CollapsibleSection
          title="Billing Details"
          subtitle="Cycle, price, discount"
          isExpanded={expandedSections.billing}
          onToggle={() => toggleSection("billing")}
        >
          <TextField
            label="Billing Cycle"
            value={formState.billingCycle}
            onChangeText={setters.setBillingCycle}
            placeholder="e.g., monthly"
          />
          <TextField
            label="Price"
            value={formState.price}
            onChangeText={setters.setPrice}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextField
            label="Currency"
            value={formState.currency}
            onChangeText={setters.setCurrency}
            placeholder="USD"
          />
          <TextField
            label="Discount Applied"
            value={formState.discountApplied}
            onChangeText={setters.setDiscountApplied}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextField
            label="Promo Code"
            value={formState.promoCode}
            onChangeText={setters.setPromoCode}
            placeholder="Enter promo code"
          />
        </CollapsibleSection>

        {/* Dates */}
        <CollapsibleSection
          title="Dates"
          subtitle="Start, end, next billing, trial end"
          isExpanded={expandedSections.dates}
          onToggle={() => toggleSection("dates")}
        >
          <DateTimeField
            label="Start Date"
            value={formState.startDate}
            onChange={setters.setStartDate}
            mode="date"
          />
          <DateTimeField
            label="End Date"
            value={formState.endDate}
            onChange={setters.setEndDate}
            mode="date"
          />
          <DateTimeField
            label="Next Billing Date"
            value={formState.nextBillingDate}
            onChange={setters.setNextBillingDate}
            mode="date"
          />
          <DateTimeField
            label="Trial End Date"
            value={formState.trialEndDate}
            onChange={setters.setTrialEndDate}
            mode="date"
          />
        </CollapsibleSection>

        {/* Payment Info */}
        <CollapsibleSection
          title="Payment Info"
          subtitle="Method, transaction, last payment, failed payments"
          isExpanded={expandedSections.payment}
          onToggle={() => toggleSection("payment")}
        >
          <TextField
            label="Payment Method"
            value={formState.paymentMethod}
            onChangeText={setters.setPaymentMethod}
            placeholder="e.g., credit_card"
          />
          <TextField
            label="Transaction ID"
            value={formState.transactionId}
            onChangeText={setters.setTransactionId}
            placeholder="Enter transaction ID"
          />
          <DateTimeField
            label="Last Payment Date"
            value={formState.lastPaymentDate}
            onChange={setters.setLastPaymentDate}
            mode="date"
          />
          <TextField
            label="Failed Payments"
            value={formState.failedPayments}
            onChangeText={setters.setFailedPayments}
            keyboardType="numeric"
            placeholder="0"
          />
        </CollapsibleSection>

        {/* Cancellation */}
        <CollapsibleSection
          title="Cancellation"
          subtitle="Cancelled at, reason, refund"
          isExpanded={expandedSections.cancellation}
          onToggle={() => toggleSection("cancellation")}
        >
          <DateTimeField
            label="Cancelled At"
            value={formState.cancelledAt}
            onChange={setters.setCancelledAt}
            mode="date"
          />
          <TextField
            label="Cancellation Reason"
            value={formState.cancellationReason}
            onChangeText={setters.setCancellationReason}
            placeholder="Enter reason"
          />
          <TextField
            label="Refund Status"
            value={formState.refundStatus}
            onChangeText={setters.setRefundStatus}
            placeholder="e.g., none"
          />
          <TextField
            label="Refund Amount"
            value={formState.refundAmount}
            onChangeText={setters.setRefundAmount}
            keyboardType="numeric"
            placeholder="0"
          />
        </CollapsibleSection>

        {/* Options */}
        <CollapsibleSection
          title="Options"
          subtitle="Auto renew, trial, platform"
          isExpanded={expandedSections.options}
          onToggle={() => toggleSection("options")}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Auto Renew</Text>
            <Switch
              value={formState.autoRenew}
              onValueChange={setters.setAutoRenew}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Trial Period</Text>
            <Switch
              value={formState.trialPeriod}
              onValueChange={setters.setTrialPeriod}
            />
          </View>
          <TextField
            label="Platform"
            value={formState.platform}
            onChangeText={setters.setPlatform}
            placeholder="e.g., ios"
          />
        </CollapsibleSection>
      </ScrollView>

      <View>
        <PrimaryButton
          title="Save Changes"
          mode="contained"
          onPress={handleSave}
        />
        <br />
        <PrimaryButton title="Cancel" mode="outlined" onPress={onCancel} />
      </View>
    </View>
  );
}
