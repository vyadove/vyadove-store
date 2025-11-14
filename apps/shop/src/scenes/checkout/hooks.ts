import { useEffect, useState } from "react";

import type { CheckoutSession } from "@vyadove/types";
import Cookies from "js-cookie";

import { payloadSdk } from "@/utils/payload-sdk";

const useSession = () => {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
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
  }, []);

  return {
    session,
    loading,
    setIsLoading,
    error,
    setError,
  };
};

export { useSession };
