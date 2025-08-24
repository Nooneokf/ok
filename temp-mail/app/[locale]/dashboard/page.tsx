import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CustomDomainManager } from "@/components/dashboard/CustomDomainManager";
import { MuteListManager } from "@/components/dashboard/MuteListManager";
import UnauthView from "@/components/dashboard/UnauthView";
import NotProView from "@/components/dashboard/NotProView";
import { fetchFromServiceAPI } from "@/lib/api";
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/app-header";
import DashboardClient from "./DashboardClient";

interface DashboardData {
    customDomains: any[];
    mutedSenders: string[];
}

export default async function DashboardPage({
    params,
}: {
    params: { locale: string };
}) {
    const session = await getServerSession(authOptions);

    let data: DashboardData | null = null;
    let accessLevel: "unauth" | "free" | "pro" = "unauth";

    if (session?.user) {
        console.log(session.user)
        if (session.user.plan === "pro") {
            accessLevel = "pro";
            try {
                data = await fetchFromServiceAPI(`/user/${session.user.id}/dashboard-data`)
            } catch (e) {
                console.error("Failed to fetch dashboard data:", e);
                data = { customDomains: [], mutedSenders: [] };
            }
        } else {
            accessLevel = "free";
        }
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen max-w-[100vw] bg-background">
                <AppHeader initialSession={session} />
                {accessLevel === "unauth" && <UnauthView />}
                {accessLevel !== "unauth" && (
                    <DashboardClient 
                        initialData={data} 
                        initialAccessLevel={accessLevel} 
                    />
                )}
            </div>
        </ThemeProvider>
    );
}
