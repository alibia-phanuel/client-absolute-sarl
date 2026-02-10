"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
// Décommente la ligne ci-dessous si tu veux les DevTools en mode développement
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 1, // 1 minute
            gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* DevTools uniquement en développement */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
}
