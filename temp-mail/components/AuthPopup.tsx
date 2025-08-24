// components/AuthPopup.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Info, Loader2, Gift } from "lucide-react"; // <-- Import Loader2 and Gift
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FaDiscord } from "react-icons/fa";

// --- DATA STRUCTURE FOR PLANS ---
// We define the features and plan details here to keep the JSX clean.
const plansData = [
    {
        title: "Guest (No Login)",
        description: "For quick, anonymous use.",
        isCurrent: true, // To identify the current plan
        isPopular: false,
        button: {
            label: "You are here",
            variant: "secondary",
            disabled: true
        },
        features: [
            { text: "5 Emails per Mailbox", tooltip: "Only the 5 most recent emails are kept on our server." },
            { text: "12-Hour Email Storage", tooltip: "Emails are automatically and permanently deleted after 12 hours." },
            { text: "No Attachments Received", tooltip: "Emails with attachments are blocked. You will be notified but cannot view the content.", notAvailable: true },
            { text: "No Custom Email Names", tooltip: "You can only use randomly generated email addresses.", notAvailable: true },
            { text: "No Keyboard Shortcuts", notAvailable: true },
            { text: "No Cloud or Browser Storage", notAvailable: true },
            { text: "No Custom Domains", notAvailable: true },
        ]
    },
    {
        title: "Discord Pro",
        description: "For power users & developers.",
        isPopular: true,
        button: {
            label: "Sign in with Discord",
            variant: "default",
            onClick: () => signIn('discord', { callbackUrl: '/dashboard' })
        },
        features: [
            { text: "Unlimited Mailbox Size" },
            { text: "Permanent Cloud Storage", tooltip: "Emails are saved to your private 5GB cloud storage and are never auto-deleted." },
            { text: "25MB Attachment Limit", tooltip: "Powered by GridFS for large, secure attachments." },
            { text: "Full Keyboard Shortcuts" },
            { text: "Use Your Own Domains", tooltip: "Add, verify, and use your personal domains to create emails." },
            { text: "Mute Senders", tooltip: "Block unwanted senders from reaching your inbox." },
            { text: "No Announcement Popups" },
            { text: "Discord Integration", tooltip: "Connect with your Discord account for enhanced features." },
        ]
    }
];


// --- PRICING LOGIC (from previous step) ---
const USD_PRICING = { currency: '$', monthly: '6', yearlyText: 'or $59/year' };
const INR_PRICING = { currency: '₹', monthly: '399', yearlyText: 'or ₹3999/year' };


// --- DYNAMIC FEATURE COMPONENT ---
interface FeatureProps {
    text: string;
    tooltip?: string;
    notAvailable?: boolean;
}

const Feature = ({ text, tooltip, notAvailable = false }: FeatureProps) => {
    const Icon = notAvailable ? XCircle : CheckCircle;
    const iconColor = notAvailable ? "text-destructive" : "text-green-500";
    const textClass = notAvailable ? "line-through text-muted-foreground" : "";

    return (
        <li className="flex items-start gap-3 text-sm">
            <Icon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
            <span className={cn("flex-grow", textClass)}>
                {text}
            </span>
            {tooltip && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </li>
    );
};


// --- MAIN POPUP COMPONENT ---
interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
    const [pricing, setPricing] = useState(USD_PRICING);
    const [isGeoLoading, setIsGeoLoading] = useState(true);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null); // <-- NEW: State to track loading plan
    const [redeemCode, setRedeemCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsGeoLoading(true);
            fetch("/api/get-geo")
                .then(res => res.json())
                .then(data => {
                    console.log("Geo:", data);
                    if (data.countryCode === "IN") setPricing(INR_PRICING);
                    else setPricing(USD_PRICING);
                })
                .catch(() => setPricing(USD_PRICING))
                .finally(() => setIsGeoLoading(false));
        }
    }, [isOpen]);

    const handleRedeemCode = async () => {
        if (!redeemCode.trim()) {
            toast.error("Please enter a redeem code");
            return;
        }

        setIsRedeeming(true);
        try {
            const response = await fetch("/api/redeem-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: redeemCode }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Code redeemed successfully! Please sign in with Discord to activate your pro plan.");
                setRedeemCode("");
                // Trigger Discord sign-in after successful redemption
                signIn('discord', { callbackUrl: '/dashboard' });
            } else {
                toast.error(data.message || "Invalid redeem code");
            }
        } catch (error) {
            toast.error("Failed to redeem code. Please try again.");
        } finally {
            setIsRedeeming(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-6xl overflow-y-auto max-h-screen">
                <TooltipProvider>
                    <DialogHeader>
                        <DialogTitle className="text-2xl lg:text-3xl text-center">Compare Our Plans</DialogTitle>
                        <DialogDescription className="text-center">
                            Choose the plan that's right for you. Your journey to a better temporary email starts here.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                        {plansData.map((plan) => {
                            const isLoadingThisPlan = loadingPlan === plan.title; // <-- NEW: Check if this plan is loading
                            return (
                                <div key={plan.title} className={cn(
                                    "border rounded-lg p-6 flex flex-col",
                                    plan.isPopular && "border-2 border-primary"
                                )}>
                                    {plan.isPopular && (
                                        <div className="text-center mb-4">
                                            <span className="bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full">Most Popular</span>
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-center">{plan.title}</h3>
                                    <p className="text-muted-foreground text-center text-sm mb-4 h-10">{plan.description}</p>
    
                                    <div className="text-center mb-6 h-16 flex items-center justify-center">
                                        {plan.title === "Discord Pro" ? (
                                            isGeoLoading ? (
                                                <div className="space-y-2">
                                                    <Skeleton className="h-8 w-24 mx-auto" />
                                                    <Skeleton className="h-4 w-20 mx-auto" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <p className="text-3xl font-bold">{pricing.currency}{pricing.monthly} <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                                                    <p className="text-muted-foreground text-sm">{pricing.yearlyText}</p>
                                                </div>
                                            )
                                        ) : (
                                            <p className="text-3xl font-bold">$0 <span className="text-lg font-normal text-muted-foreground">/ forever</span></p>
                                        )}
                                    </div>
    
                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {plan.features.map(feature => (
                                            <Feature key={feature.text} {...feature} />
                                        ))}
                                    </ul>
                                    
                                    {/* --- REVISED BUTTON LOGIC --- */}
                                    <Button
                                        onClick={() => {
                                            if (plan.button.onClick) {
                                                setLoadingPlan(plan.title); // Set loading state for this plan
                                                plan.button.onClick();   // Execute the sign-in action
                                            }
                                        }}
                                        variant={plan.button.variant as any}
                                        disabled={plan.button.disabled || isLoadingThisPlan} // Disable if this plan is loading
                                        className="w-full"
                                    >
                                        {isLoadingThisPlan ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Redirecting...
                                            </>
                                        ) : (
                                            <>
                                                {plan.title.includes("Discord") && ( // Show logo for Discord plans
                                                    <FaDiscord className="w-5 h-5 mr-2" />
                                                )}
                                                {plan.button.label}
                                            </>
                                        )}
                                    </Button>
                                    
                                    {/* Redeem Code Section - Only show for Discord Pro plan */}
                                    {plan.title === "Discord Pro" && (
                                        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Gift className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">Have a redeem code?</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter redeem code"
                                                    value={redeemCode}
                                                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                                                    className="flex-1"
                                                    disabled={isRedeeming}
                                                />
                                                <Button
                                                    onClick={handleRedeemCode}
                                                    disabled={isRedeeming || !redeemCode.trim()}
                                                    size="sm"
                                                >
                                                    {isRedeeming ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        "Redeem"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    );
}