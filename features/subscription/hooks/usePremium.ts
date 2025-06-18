import {
    useCreateCheckoutSessionMutation,
    useGetPremiumFeedQuery,
} from '../api/premiumApi';

export const usePremium = () => {
  const {
    data: premiumFeed,
    isLoading: premiumFeedLoading,
    refetch: refetchPremiumFeed,
  } = useGetPremiumFeedQuery();

  const [
    createCheckoutSession,
    { data: checkoutData, isLoading: checkoutLoading, error: checkoutError },
  ] = useCreateCheckoutSessionMutation();

  const initiatePayment = async () => {
    try {
      const response = await createCheckoutSession().unwrap();
      return response.url;
    } catch (error) {
      throw error;
    }
  };

  return {
    premiumFeed,
    premiumFeedLoading,
    refetchPremiumFeed,
    initiatePayment,
    checkoutData,
    checkoutLoading,
    checkoutError,
  };
};
