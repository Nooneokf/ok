"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Crown, Zap, Shield, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";

export default function NotProView() {
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { data: session } = useSession();

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

      if (response.ok && data.validCode) {
        toast.success("Pro code redeemed successfully! Upgrading your account...");
        setRedeemCode("");
        
        // Call upgrade API with the validated code
        try {
          const upgradeResponse = await fetch("/api/upgrade-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validCode: true }),
          });
          
          const upgradeData = await upgradeResponse.json();
          
          if (upgradeResponse.ok) {
            toast.success("Account upgraded to Pro successfully!");
            // Trigger session update and redirect
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            toast.error(upgradeData.message || "Failed to upgrade account");
          }
        } catch (error) {
          console.error("Failed to upgrade plan:", error);
          toast.error("Failed to upgrade account. Please try again.");
        }
      } else {
        toast.error(data.message || "Invalid redeem code");
      }
    } catch (error) {
      toast.error("Failed to redeem code. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const proFeatures = [
    { icon: Crown, text: "Unlimited Mailbox Size", desc: "No limits on emails stored" },
    { icon: Shield, text: "Permanent Cloud Storage", desc: "5GB secure cloud backup" },
    { icon: Zap, text: "25MB Attachments", desc: "Large file support" },
    { icon: Star, text: "Custom Domains", desc: "Use your own domain names" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {session?.user?.name || "Discord User"}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Free Plan
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Upgrade to Pro</h1>
          <p className="text-muted-foreground text-lg">
            Unlock powerful features with a Pro redemption code
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pro Features */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{feature.text}</div>
                    <div className="text-sm text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Redeem Code */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Redeem Pro Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-primary mb-1">Enter Redemption Code</div>
                  <div className="text-sm text-muted-foreground">Enter your Pro access code to unlock features</div>
                </div>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your redemption code"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    className="font-mono text-center"
                    disabled={isRedeeming}
                  />
                  <Button
                    onClick={handleRedeemCode}
                    disabled={isRedeeming || !redeemCode.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isRedeeming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem Pro Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Valid codes upgrade your account to Pro with all premium features
              </div>
              
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>Don't have a code? Contact support or check our promotions.</p>
                <p className="font-mono text-xs">Example codes: TEMPMAIL_PRO_2024, PREMIUM_ACCESS_2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}