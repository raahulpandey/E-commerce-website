'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BackendWakeUp } from '@/components/common/BackendWakeUp';

function BootstrapWrapper({ children }: { children: React.ReactNode }) {
  useBootstrap();
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,  // 5 minutes — don't refetch if data is fresh
            gcTime: 30 * 60 * 1000,    // 30 minutes — keep in memory
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <BackendWakeUp />
        <BootstrapWrapper>{children}</BootstrapWrapper>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { borderRadius: '12px' },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
