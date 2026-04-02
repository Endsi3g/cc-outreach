"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  ChatCircleText, 
  PaperPlaneTilt, 
  TrendUp,
  ArrowUpRight,
  DotsThreeVertical,
  Lightning,
  Sparkle,
  Target,
  Circle
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GlobalStats {
  totalLeads: number;
  totalDrafts: number;
  totalSent: number;
  totalReplies: number;
  replyRate: number;
}

interface Activity {
  eventType: string;
  createdAt: string;
  id: string;
}

interface NicheStat {
  niche: string;
  count: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [niches, setNiches] = useState<NicheStat[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token");
          if (token) headers["Authorization"] = `Bearer ${token}`;
        }

        const [statsRes, activitiesRes, nichesRes] = await Promise.all([
          fetch(`${API_URL}/analytics/global`, { headers }),
          fetch(`${API_URL}/analytics/activities`, { headers }),
          fetch(`${API_URL}/analytics/niches`, { headers }),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (activitiesRes.ok) setActivities(await activitiesRes.json());
        if (nichesRes.ok) setNiches(await nichesRes.json());
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  if (loading) return <LoadingState />;

  const totalNicheCount = niches.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <motion.div 
      className="space-y-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-accent-slate/10 text-accent-slate text-[10px] font-bold tracking-widest uppercase">
              Vue d'ensemble
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
              <Circle size={8} weight="fill" className="text-emerald-500 animate-pulse" />
              Live Analytics
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-3">
            Tableau de <span className="text-accent-slate">Bord</span>
          </h1>
          <p className="text-text-secondary max-w-md leading-relaxed">
            Propulsez votre outreach avec des insights actionnables et une automatisation fluide.
          </p>
        </motion.div>
        
        <motion.div variants={item} className="flex gap-4">
          <Button variant="outline" className="rounded-full px-8 hover:bg-white border-black/5 h-12">
            Exporter
          </Button>
          <Button className="rounded-full px-8 bg-accent-slate hover:bg-accent-slate-deep h-12 shadow-lg shadow-accent-slate/20">
            Nouveau Lead
          </Button>
        </motion.div>
      </header>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Stat: Total Leads */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
          <StatCard 
            title="Total Prospects" 
            value={stats?.totalLeads.toLocaleString() || "1,284"} 
            trend="+12%" 
            icon={<Users weight="duotone" className="text-accent-slate" size={32} />} 
          />
        </motion.div>

        {/* Stat: Reply Rate */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
          <StatCard 
            title="Taux de Réponse" 
            value={`${stats?.replyRate || 24}%`} 
            trend="+5%" 
            icon={<ChatCircleText weight="duotone" className="text-emerald-500" size={32} />} 
          />
        </motion.div>

        {/* Stat: Sent Emails */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
          <StatCard 
            title="Emails Envoyés" 
            value={stats?.totalSent.toLocaleString() || "482"} 
            trend="+24" 
            icon={<PaperPlaneTilt weight="duotone" className="text-blue-500" size={32} />} 
          />
        </motion.div>

        {/* Stat: Drafts */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
          <StatCard 
            title="Brouillons" 
            value={stats?.totalDrafts.toLocaleString() || "12"} 
            trend="Stable" 
            icon={<TrendUp weight="duotone" className="text-amber-500" size={32} />} 
          />
        </motion.div>

        {/* Large Bento Card: Recent Activity */}
        <motion.div variants={item} className="md:col-span-4 lg:col-span-8 h-full">
          <Card className="h-full border-none shadow-premium flex flex-col">
            <CardHeader className="p-10 border-b border-black/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-1">Activités Récentes</CardTitle>
                  <CardDescription>Les dernières pulsations de votre pipeline</CardDescription>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent-slate/5 flex items-center justify-center text-accent-slate">
                  <Lightning weight="fill" size={24} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-black/5">
                {(activities.length > 0 ? activities : mockActivities).map((activity, i) => (
                  <div key={activity.id || i} className="flex items-center gap-6 p-6 hover:bg-accent-slate/[0.02] transition-colors group">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-accent-slate group-hover:scale-110 transition-transform shadow-sm">
                      <ArrowUpRight size={20} weight="bold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text-primary tracking-tight">{activity.eventType}</p>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">
                        {new Date(activity.createdAt).toLocaleDateString("fr-CA", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button className="text-text-tertiary hover:text-text-primary" title="Actions">
                      <DotsThreeVertical size={24} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 mt-auto">
                <Button variant="ghost" className="w-full rounded-2xl border border-dashed border-black/10 hover:border-accent-slate/50 hover:bg-accent-slate/5 text-text-secondary text-xs uppercase tracking-widest font-bold">
                  Voir tout le flux
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medium Bento Card: Niche Distribution */}
        <motion.div variants={item} className="md:col-span-4 lg:col-span-4">
          <Card className="h-full border-none shadow-premium bg-accent-slate/5 border border-accent-slate/10 overflow-hidden relative">
            {/* Decorative Sparkle */}
            <div className="absolute top-[-20px] right-[-20px] opacity-10 text-accent-slate">
              <Sparkle size={120} weight="fill" />
            </div>

            <CardHeader className="p-10 border-b border-black/5 relative z-10">
              <CardTitle className="text-2xl mb-1">Par Niche</CardTitle>
              <CardDescription>Top segments qualifiés</CardDescription>
            </CardHeader>
            <CardContent className="p-10 relative z-10 h-full">
              <div className="space-y-8">
                {(niches.length > 0 ? niches : mockNiches).slice(0, 5).map((niche, i) => (
                  <ProgressItem 
                    key={niche.niche} 
                    label={niche.niche} 
                    value={totalNicheCount > 0 ? Math.round((niche.count / totalNicheCount) * 100) : (100 - i * 15)} 
                    index={i}
                  />
                ))}
              </div>
              
              <div className="mt-12 p-6 rounded-3xl bg-white/60 border border-white shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-slate flex items-center justify-center text-white shadow-lg shadow-accent-slate/20">
                    <Target size={20} weight="fill" />
                  </div>
                  <p className="text-sm font-bold">Objectif Mensuel</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-3xl font-bold tracking-tight">85<span className="text-sm text-text-tertiary ml-1">%</span></p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">+4% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <Card className="h-full border-none shadow-premium group transition-all duration-500 hover:bg-white">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="w-14 h-14 rounded-3xl bg-accent-slate/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-accent-slate group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent-slate/20">
            {icon}
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold tracking-widest uppercase">
            {trend}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em]">{title}</p>
          <p className="text-4xl font-bold tracking-tight text-text-primary group-hover:text-accent-slate transition-colors">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressItem({ label, value, index }: { label: string, value: number, index: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm items-center">
        <span className="text-text-primary font-bold tracking-tight">{label}</span>
        <span className="text-text-tertiary text-xs font-mono">{value}%</span>
      </div>
      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden border border-black/[0.02]">
        <motion.div 
          className="h-full bg-accent-slate rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-[80vh] items-center justify-center flex-col gap-6">
      <div className="w-20 h-20 rounded-[2.5rem] bg-accent-slate/10 animate-pulse flex items-center justify-center text-accent-slate">
        <Sparkle size={40} className="animate-spin-slow" />
      </div>
      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em] animate-pulse">Syncing Engine...</p>
    </div>
  );
}

const mockActivities = [
  { eventType: "Email ouvert par Toitures XYZ", createdAt: new Date().toISOString(), id: "1" },
  { eventType: "Nouveau lead détecté: Construction ABC", createdAt: new Date(Date.now() - 3600000).toISOString(), id: "2" },
  { eventType: "Draft généré pour Plomberie Dupont", createdAt: new Date(Date.now() - 7200000).toISOString(), id: "3" },
];

const mockNiches = [
  { niche: "Toiture", count: 45 },
  { niche: "Excavation", count: 32 },
  { niche: "Plomberie", count: 28 },
  { niche: "HVAC", count: 15 },
];
