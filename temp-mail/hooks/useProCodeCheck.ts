"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useProCodeCheck() {
  const { data: session, update, status } = useSession();

  useEffect(() => {
    const checkAndUpgradeProStatus = async () => {
      // Only check if user is authenticated and currently on free plan
      if (status === 'authenticated' && session?.user && session.user.plan === 'free') {
        const hasProCode = localStorage.getItem('hasProCode');
        const proCodeRedeemed = localStorage.getItem('proCodeRedeemed');
        
        if (hasProCode === 'true' && proCodeRedeemed === 'FREEPRO2024') {
          console.log('Pro code detected, upgrading session...');
          
          try {
            // Update the session to pro status
            await update({
              plan: 'pro',
              hasProCode: true
            });
            
            console.log('Session upgraded to pro successfully');
          } catch (error) {
            console.error('Failed to upgrade session:', error);
          }
        }
      }
    };

    checkAndUpgradeProStatus();
  }, [session, status, update]);

  return {
    isPro: session?.user?.plan === 'pro',
    hasSession: status === 'authenticated',
    isLoading: status === 'loading'
  };
}