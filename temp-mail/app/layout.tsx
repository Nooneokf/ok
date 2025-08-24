export const metadata = {
  title: 'Custom Temp Mail – Fastest Ad‑Free Disposable Email',
  description: 'Generate a custom temp mail address instantly—choose from multiple domains, no registration, no ads, forever free.',
  keywords: 'temp mail, disposable email, custom mail, fake email, temporary inbox, no ads email, 10minmail, email privacy, free temp mail',
  openGraph: {
    title: 'Custom Temp Mail – Fastest Ad‑Free Disposable Email',
    description: 'Generate a custom temp mail address instantly—choose from multiple domains, no registration, no ads, forever free.',
    url: 'https://www.tempmail.encorebot.me/',
    images: [
      {
        url: 'https://www.tempmail.encorebot.me/logo.webp',
        alt: 'tempmail.encorebot.me Logo',
      },
    ],
  },
};
import { GoogleAnalytics } from '@next/third-parties/google';
import "@/styles/global.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth"; // server-side session fetch
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions); // fetch session server-side with proper auth config

  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId="G-RXTEEVC8C4" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
