import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CustomDomainManager } from "@/components/dashboard/CustomDomainManager";
import { MuteListManager } from "@/components/dashboard/MuteListManager";
import UnauthView from "@/components/dashboard/UnauthView";
import { fetchFromServiceAPI } from "@/lib/api";
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/app-header";

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
    let accessLevel: "unauth" | "pro" = "unauth";

    if (session?.user) {
        console.log(session.user)
        // All Discord users are pro by default
        accessLevel = "pro";
        try {
            data = await fetchFromServiceAPI(`/user/${session.user.id}/dashboard-data`)
        } catch (e) {
            // If API fails, still show pro dashboard with empty data
            console.error("Failed to fetch dashboard data:", e);
            data = { customDomains: [], mutedSenders: [] };
        }
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen max-w-[100vw] bg-background">
                <AppHeader initialSession={session} />
                {accessLevel === "unauth" && <UnauthView />}
                {accessLevel === "pro" && data && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2">Discord Pro Dashboard</h1>
                            <p className="text-muted-foreground">Manage your custom domains and email preferences</p>
                        </div>
                        <div className="grid gap-8 max-w-6xl mx-auto">
                            <CustomDomainManager initialDomains={data.customDomains} />
                            <MuteListManager initialSenders={data.mutedSenders} />
                        </div>
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}
