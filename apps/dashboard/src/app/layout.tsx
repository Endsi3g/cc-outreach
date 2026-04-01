import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {
  BarChart3,
  Users,
  Mail,
  Search,
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import Link from "next/link";
import React from "react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uprise Sales OS",
  description: "Plateforme de prospection B2B propulsée par IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={outfit.className}>
        <div className="flex min-h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 sidebar-glass fixed inset-y-0 left-0 z-50 flex flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white logo">Sales OS</span>
            </div>

            <nav className="flex-1 space-y-2">
              <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Tableau de Bord" active />
              <NavItem href="/leads" icon={<Users size={20} />} label="Prospects" />
              <NavItem href="/campaigns" icon={<Mail size={20} />} label="Campagnes" />
              <NavItem href="/analytics" icon={<BarChart3 size={20} />} label="Analytique" />
              <NavItem href="/search" icon={<Search size={20} />} label="Recherche" />
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-2">
              <NavItem href="/settings" icon={<Settings size={20} />} label="Paramètres" />
              <NavItem href="/logout" icon={<LogOut size={20} />} label="Déconnexion" />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${active
          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-white/10'
          : 'text-slate-400 hover:text-white hover:bg-white/5'}
      `}
    >
      <span className={active ? 'text-indigo-400' : 'group-hover:text-indigo-400 opacity-80'}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
