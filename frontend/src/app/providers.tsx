'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { CartDrawer } from '@/components/cart/CartDrawer';

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
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
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
