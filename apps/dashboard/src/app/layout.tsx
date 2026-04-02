"use client";

import React from "react";
import "./globals.css";
import { 
  ChartLine, 
  Users, 
  Kanban, 
  Envelope, 
  ChartBar, 
  Gear, 
  SignOut,
  MagnifyingGlass,
  Bell,
  NavigationArrow
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", icon: ChartLine },
  { href: "/leads", label: "Prospects", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/campaigns", label: "Campagnes", icon: Envelope },
  { href: "/analytics", label: "Analytique", icon: ChartBar },
];

const secondaryNav = [
  { href: "/settings", label: "Paramètres", icon: Gear },
  { href: "/logout", label: "Quitter", icon: SignOut },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="fr">
      <body className="noise-bg font-geist text-text-primary antialiased bg-canvas-warm">
        <div className="flex min-h-screen relative overflow-hidden">
          {/* Asymmetric Design Layer: Decorative Background Elements */}
          <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[120%] bg-accent-slate/5 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Main Layout Wrapper */}
          <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full">
            {/* Sidebar / Left Info Area (Minimalist & Asymmetric) */}
            <aside className="hidden lg:flex w-80 h-screen sticky top-0 flex-col p-12 border-r border-black/5 bg-white/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-20">
                <div className="w-12 h-12 bg-accent-slate rounded-2xl flex items-center justify-center shadow-lg shadow-accent-slate/20">
                  <NavigationArrow size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-text-primary">Uprise</h1>
                  <p className="text-xs text-text-secondary font-medium tracking-widest uppercase">Sales Engine</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-12">
                  <div>
                    <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-6">Système</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Statut de l'IA</span>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[10px] text-emerald-600">OPÉRATIONNEL</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Threads Actifs</span>
                        <span className="font-mono text-[10px] text-text-primary">124</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-6">Opportunité</h3>
                    <div className="p-4 rounded-3xl bg-accent-slate/5 border border-accent-slate/10">
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        "L'analyse détecte un pic de besoin dans la niche <span className="text-accent-slate font-bold">Toiture (Montréal)</span>."
                      </p>
                      <button className="text-[10px] font-bold text-accent-slate uppercase tracking-wider hover:underline">
                        Détails →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/50 border border-black/5">
                  <div className="w-10 h-10 rounded-full bg-accent-slate/10 flex items-center justify-center text-accent-slate font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">John Doe</p>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Administrateur</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 relative">
              {/* Floating Top Mini Nav */}
              <div className="h-20 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-30 bg-canvas-warm/80 backdrop-blur-md">
                <div className="relative group max-w-sm w-full hidden md:block">
                  <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-slate transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Command / Recherche..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-black/5 rounded-full text-sm focus:outline-none focus:bg-white focus:border-accent-slate/30 focus:shadow-premium transition-all"
                  />
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  <button title="Notifications" className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-text-secondary hover:text-accent-slate transition-all shadow-sm">
                    <Bell size={20} />
                  </button>
                  <button title="Utilisateurs" className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-text-secondary hover:text-accent-slate transition-all shadow-sm lg:hidden">
                    <Users size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 lg:p-12 pb-32 max-w-[1400px] mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>

          {/* Floating Dock Navigation (iOS Style) */}
          <nav className="nav-dock">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div 
                    className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={24} weight={isActive ? "fill" : "regular"} />
                    <span className="text-[9px] uppercase font-bold tracking-[0.15em] hidden md:block">
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="absolute -bottom-1 w-1 h-1 bg-accent-slate rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            <div className="w-[1px] h-8 bg-black/5 mx-2" />
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div 
                    className="nav-item opacity-60 hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={24} />
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </body>
    </html>
  );
}
