'use client';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps{
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
        />
    </>
  );
}