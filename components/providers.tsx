'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
