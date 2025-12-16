import { useEffect, useState } from "react";

import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import type { CheckoutSession } from "@vyadove/types";
import Cookies from "js-cookie";

import { payloadSdk } from "@/utils/payload-sdk";

const useCheckoutSession = () => {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [sessionId, setSessionId] = useState(
    Cookies.get("checkout-session") || null,
  );

  const checkoutSessionQuery = usePayloadFindQuery("checkout-sessions", {
    findArgs: {
      where: {
        sessionId: {
          equals: sessionId,
        },
      },
    },
    useQueryArgs: {
      // enabled: !!sessionId,
    },
  });

  useEffect(() => {
    setSessionId(Cookies.get("checkout-session") || null);
  }, []);

  /*useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const sessionId = Cookies.get("checkout-session");

        let sessionData: CheckoutSession | null = null;

        if (!sessionId) {
          setSession(null);
        } else {
          const existingSession = await payloadSdk.find({
            collection: "checkout-sessions",
            where: {
              sessionId: {
                equals: sessionId,
              },
            },
          });

          sessionData = existingSession.docs?.[0] || null;
        }

        setSession(sessionData);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);*/

  return {
    checkoutSessionQuery,
    session: checkoutSessionQuery.data?.docs?.[0] || null,
    loading: checkoutSessionQuery.isLoading,
    error:
      checkoutSessionQuery.data?.errors || checkoutSessionQuery.error
        ? {
            message:
              checkoutSessionQuery.error?.message ||
              "Error fetching checkout session",
          }
        : null,
  };
};

export { useCheckoutSession };
