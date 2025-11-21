"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const reactQueryClient = new QueryClient({
  // queryCache: new QueryCache({}),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});

const TanStackQueryProvider = ({ children }: React.PropsWithChildren) => {
  // const [queryClient] = useState(reactQueryClient);

  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanStackQueryProvider;
