"use client";

import React, { useState } from "react";
import { AuthPopup } from "@/components/AuthPopup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Crown, Star } from "lucide-react";

export default function UnauthView() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const features = [
    { icon: Crown, text: "Unlimited Mailbox Size", desc: "No limits on stored emails" },
    { icon: Shield, text: "Custom Domains", desc: "Use your own domain names" },
    { icon: Zap, text: "25MB Attachments", desc: "Large file support" },
    { icon: Star, text: "Pro Features", desc: "Access all premium features" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to TempMail Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign in with Discord to access your temporary email dashboard and unlock powerful features
          </p>
          <Button
            onClick={() => setIsAuthOpen(true)}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Sign In with Discord
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border-none bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Temporary email addresses</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>12-hour email storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-primary" />
                  <span>Multiple domain options</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-yellow-500/5 to-yellow-600/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Pro Plan Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <feature.icon className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">{feature.text}</div>
                    <div className="text-sm text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to get started? Sign in to access your dashboard
          </p>
          <Button
            onClick={() => setIsAuthOpen(true)}
            variant="outline"
            size="lg"
          >
            Sign In Now
          </Button>
        </div>
      </div>
      
      <AuthPopup isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
