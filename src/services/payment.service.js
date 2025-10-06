// placeholder: integrate Stripe / Payme / Click
export const processPayment = async ({ amount, paymentMethod }) => {
  // simulate
  return { success: true, provider: "mock", transactionId: "tx_" + Date.now() };
};
