"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useProCodeCheck() {
  const { data: session, update, status } = useSession();

  useEffect(() => {
    // Check if user needs plan verification on session load
    const verifyUserPlan = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // Verify current plan status with backend
          const response = await fetch('/api/verify-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id })
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Update session if plan status differs
            if (data.plan !== session.user.plan) {
              await update({
                plan: data.plan,
                hasProCode: data.hasProCode
              });
            }
          }
        } catch (error) {
          console.error('Failed to verify plan status:', error);
        }
      }
    };

    verifyUserPlan();
  }, [session?.user?.id, status, update]);

  return {
    isPro: session?.user?.plan === 'pro',
    hasSession: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
  };
}