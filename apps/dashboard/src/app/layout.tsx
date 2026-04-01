import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

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
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased`}>
        {/* Ambient background for depth */}
        <div className="ambient-bg" />

        <div className="flex min-h-screen">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 ml-64 min-h-screen">
            {/* Top Navigation Bar */}
            <TopNav />

            {/* Page Content */}
            <div className="p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

// Sidebar Component
function Sidebar() {
  const navItems = [
    { href: "/", label: "Tableau de bord", icon: "chart" },
    { href: "/leads", label: "Prospects", icon: "users" },
    { href: "/pipeline", label: "Pipeline", icon: "pipeline" },
    { href: "/campaigns", label: "Campagnes", icon: "mail" },
    { href: "/analytics", label: "Analytique", icon: "barChart" },
  ];

  const secondaryNav = [
    { href: "/settings", label: "Paramètres", icon: "settings" },
    { href: "/logout", label: "Déconnexion", icon: "logout" },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-[var(--border)]">
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--text-primary)] rounded flex items-center justify-center">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
          <div>
            <span className="text-[var(--text-primary)] font-semibold tracking-tight">Uprise</span>
            <span className="block text-[var(--text-secondary)] text-xs">Sales OS</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-[var(--border)] space-y-1">
        {secondaryNav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </aside>
  );
}

// Navigation Item Component
function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  // Simple SVG icons - minimalist style
  const icons: Record<string, React.ReactNode> = {
    chart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 17V12" />
        <path d="M12 17V8" />
        <path d="M16 17V14" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    pipeline: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    mail: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    barChart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    logout: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </svg>
    ),
  };

  return (
    <a
      href={href}
      className="nav-item group"
    >
      <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
        {icons[icon]}
      </span>
      <span>{label}</span>
    </a>
  );
}

// Top Navigation Component
function TopNav() {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-white/80 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--canvas-warm)] border border-transparent rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border)] focus:bg-white transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--canvas-warm)] rounded-lg transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-red-text)] rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-3 p-1.5 hover:bg-[var(--canvas-warm)] rounded-lg transition-colors">
          <div className="w-8 h-8 bg-[var(--text-primary)] rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">JD</span>
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">John Doe</span>
          <svg className="text-[var(--text-tertiary)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
