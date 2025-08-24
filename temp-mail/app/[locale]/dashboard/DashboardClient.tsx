"use client";

import { useProCodeCheck } from "@/hooks/useProCodeCheck";
import { CustomDomainManager } from "@/components/dashboard/CustomDomainManager";
import { MuteListManager } from "@/components/dashboard/MuteListManager";
import NotProView from "@/components/dashboard/NotProView";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface DashboardData {
    customDomains: any[];
    mutedSenders: string[];
}

interface DashboardClientProps {
    initialData: DashboardData | null;
    initialAccessLevel: "unauth" | "free" | "pro";
}

export default function DashboardClient({ initialData, initialAccessLevel }: DashboardClientProps) {
    const { isPro, hasSession, isLoading } = useProCodeCheck();
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(initialData);
    const [accessLevel, setAccessLevel] = useState(initialAccessLevel);

    useEffect(() => {
        if (hasSession && session?.user) {
            if (isPro && accessLevel !== "pro") {
                setAccessLevel("pro");
                // Fetch pro data if we just upgraded
                if (!data || data.customDomains.length === 0) {
                    fetchProData();
                }
            } else if (!isPro && session.user.plan === 'free') {
                setAccessLevel("free");
            }
        }
    }, [isPro, hasSession, session, accessLevel, data]);

    const fetchProData = async () => {
        if (session?.user?.id) {
            try {
                const response = await fetch(`/api/user/${session.user.id}/dashboard-data`);
                if (response.ok) {
                    const dashboardData = await response.json();
                    setData(dashboardData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setData({ customDomains: [], mutedSenders: [] });
            }
        }
    };

    if (accessLevel === "free") {
        return <NotProView />;
    }

    if (accessLevel === "pro" && data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold rounded-full">
                            PRO
                        </div>
                        <span className="text-sm text-muted-foreground">Pro Plan Activated</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        Pro Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome {session?.user?.name}! Manage your custom domains and email preferences
                    </p>
                </div>
                <div className="grid gap-8 max-w-6xl mx-auto">
                    <CustomDomainManager initialDomains={data.customDomains} />
                    <MuteListManager initialSenders={data.mutedSenders} />
                </div>
            </div>
        );
    }

    return null;
}