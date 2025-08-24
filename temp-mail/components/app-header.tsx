// components/app-header.tsx
"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu as MenuIconLucide, X as CloseIcon, Gift } from "lucide-react";
import Link from 'next/link';
import { FaDiscord, FaGithub, FaPatreon } from "react-icons/fa";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Navigation from "./Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthPopup } from './AuthPopup';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { LATEST_CHANGELOG_VERSION } from "@/lib/changelog";
import { WhatsNewModal } from "./WhatsNewModal";
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

export function AppHeader({ initialSession }: { initialSession: Session | null; }) {
  const { data: session, status } = useSession()
  // Use client-side session data instead of server-side initialSession for real-time updates
  // Fallback to initialSession if client session is still loading
  const activeSession = session || (status === 'loading' ? initialSession : null)
  const t = useTranslations('AppHeader');
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [hasSeenLatest, setHasSeenLatest] = useState(true);

  useEffect(() => {
    const seenVersion = localStorage.getItem('seenChangelogVersion');
    if (seenVersion !== LATEST_CHANGELOG_VERSION) {
      setHasSeenLatest(false);
    }
  }, []);

  const openWhatsNew = () => {
    setIsWhatsNewOpen(true);
    localStorage.setItem('seenChangelogVersion', LATEST_CHANGELOG_VERSION);
    setHasSeenLatest(true);
  };

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleMobileMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const renderAuthButton = () => {
    if (status === 'loading') {
      return <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>;
    }

    if (status === 'authenticated' && activeSession?.user) {
      const userPlan = activeSession.user?.plan || 'free';
      const isPro = userPlan === 'pro';

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0">
              {/* Avatar Container with Pro Glow Effect */}
              <div className={`relative h-full w-full rounded-full border-2 transition-all duration-300 ${
                isPro 
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}>
                {activeSession.user.image ? (
                  <img
                    src={activeSession.user.image}
                    alt={activeSession.user.name || 'User avatar'}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-muted rounded-full text-muted-foreground">
                    {activeSession.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Enhanced Plan Badge */}
              <div className="absolute -bottom-2 w-full flex justify-center">
                <div className={`rounded-md px-2 py-0.5 text-[9px] font-bold border transition-all duration-300 ${
                  isPro 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-300 shadow-sm' 
                    : 'bg-secondary text-secondary-foreground border-border'
                }`}>
                  {isPro ? 'PRO' : 'FREE'}
                </div>
              </div>

              {/* Pro Sparkle Effect */}
              {isPro && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{activeSession.user.name}</p>
                  {isPro && (
                    <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-[10px] font-bold rounded-full">
                      PRO
                    </div>
                  )}
                </div>
                <p className="text-xs leading-none text-muted-foreground">{activeSession.user.email}</p>
                {isPro && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    FREEPRO2024 Active
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <span>Dashboard</span>
                {isPro && <span className="text-yellow-500">✨</span>}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return <Button onClick={() => setIsPopupOpen(true)} className='md:p-4 p-2'>Login</Button>;
  };

  return (
    <>
      <header className="border-b w-full relative z-50 bg-background">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Home" onClick={menuOpen ? handleMobileLinkClick : undefined}>
            <Image
              src="/logo.webp"
              alt="tempmail.encorebot.me Logo"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <span className="text-base hidden xs:block sm:text-lg md:text-xl font-bold whitespace-nowrap">tempmail.encorebot.me</span>
            <span className="text-base block xs:hidden font-bold whitespace-nowrap">FC.E</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Navigation />
            {renderAuthButton()}
            <Button variant="ghost" size="icon" onClick={openWhatsNew} className="relative p-2" aria-label={'whats new'}>
              <Gift className="h-5 w-5" />
              {!hasSeenLatest && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="p-2" aria-label={t('aria_toggle_theme')}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t('aria_toggle_theme')}</span>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {renderAuthButton()}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="p-2" aria-label={t('aria_toggle_theme')}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t('aria_toggle_theme')}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="p-2" aria-label={menuOpen ? t('aria_close_menu') : t('aria_open_menu')} aria-expanded={menuOpen}>
              <MenuIconLucide className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/40" onClick={() => setMenuOpen(false)} />
              <motion.div ref={menuRef} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed top-0 right-0 bottom-0 w-72 bg-background z-40 shadow-lg p-6 flex flex-col gap-4 md:hidden">
                <button className="ml-auto mb-4 p-1 rounded hover:bg-accent" onClick={() => setMenuOpen(false)} aria-label={t('aria_close_menu')}>
                  <CloseIcon className="h-5 w-5" />
                </button>
                <div className="flex flex-col gap-2">
                  <Link href="/docs" className="text-sm hover:underline py-1" onClick={handleMobileLinkClick}>{t('api_docs')}</Link>
                  <Link href="/blog" className="text-sm hover:underline py-1" onClick={handleMobileLinkClick}>Blog</Link>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-2 py-1" onClick={handleMobileLinkClick}><FaGithub className="h-4 w-4" /> {t('github')}</a>
                  <a href="https://www.patreon.com/maildrop" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-2 py-1" onClick={handleMobileLinkClick}><FaPatreon className="h-4 w-4" /> {t('patreon')}</a>
                  <a href="https://discord.gg/Ztp7kT2QBz" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-2 py-1" onClick={handleMobileLinkClick}><FaDiscord className="h-4 w-4" /> {t('discord')}</a>
                  <Button variant="ghost" onClick={() => { openWhatsNew(); handleMobileLinkClick(); }} className="relative p-2 w-full justify-start gap-2 mt-auto" aria-label={'whats new'}>
                    <Gift className="h-5 w-5" /> Updates
                    {!hasSeenLatest && <span className="absolute top-2 right-2 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span>}
                  </Button>

                  <Navigation />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <AuthPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <WhatsNewModal isOpen={isWhatsNewOpen} onClose={() => setIsWhatsNewOpen(false)} />
    </>
  );
}