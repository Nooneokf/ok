"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionDebug() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("=== SESSION DEBUG ===");
    console.log("Status:", status);
    console.log("Session:", session);
    console.log("User:", session?.user);
    console.log("Plan:", session?.user?.plan);
    console.log("===================");
  }, [session, status]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-2 rounded text-xs max-w-xs z-50">
      <div><strong>Status:</strong> {status}</div>
      <div><strong>User:</strong> {session?.user?.name || 'None'}</div>
      <div><strong>Plan:</strong> {session?.user?.plan || 'N/A'}</div>
    </div>
  );
}