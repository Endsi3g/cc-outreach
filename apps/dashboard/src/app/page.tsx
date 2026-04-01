"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Briefcase,
  ArrowUpRight,
  MoreVertical,
  Loader2
} from "lucide-react"

interface GlobalStats {
  totalLeads: number
  totalDrafts: number
  totalSent: number
  totalReplies: number
  replyRate: number
}

interface Activity {
  eventType: string
  createdAt: string
  id: string
}

interface NicheStat {
  niche: string
  count: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [niches, setNiches] = useState<NicheStat[]>([])
  const [loading, setLoading] = useState(true)

  // Use fallback if environment variable is not defined
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        // Retrieve token if present
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) headers['Authorization'] = `Bearer ${token}`
        }

        const [statsRes, activitiesRes, nichesRes] = await Promise.all([
          fetch(`${API_URL}/analytics/global`, { headers }),
          fetch(`${API_URL}/analytics/activities`, { headers }),
          fetch(`${API_URL}/analytics/niches`, { headers })
        ])

        if (statsRes.ok) setStats(await statsRes.json())
        if (activitiesRes.ok) setActivities(await activitiesRes.json())
        if (nichesRes.ok) setNiches(await nichesRes.json())
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [API_URL])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  const totalNicheCount = niches.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de Bord</h1>
          <p className="text-slate-400">Bienvenue, voici un aperçu de vos performances de prospection.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">Exporter</Button>
          <Button variant="uprise">Nouveau Lead</Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Prospects" 
          value={stats?.totalLeads.toLocaleString() || "0"} 
          trend="+0%" 
          icon={<Users className="text-indigo-400" />} 
          description="Total dans la base"
        />
        <StatCard 
          title="Taux de Réponse" 
          value={`${stats?.replyRate || 0}%`} 
          trend="+0%" 
          icon={<MessageSquare className="text-purple-400" />} 
          description="Engagement global"
        />
        <StatCard 
          title="Emails Envoyés" 
          value={stats?.totalSent.toLocaleString() || "0"} 
          trend="+0" 
          icon={<Briefcase className="text-emerald-400" />} 
          description="Volume total"
        />
        <StatCard 
          title="Brouillons" 
          value={stats?.totalDrafts.toLocaleString() || "0"} 
          trend="0" 
          icon={<TrendingUp className="text-amber-400" />} 
          description="En attente"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-card border-none p-0">
          <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl text-white">Activités Récentes</CardTitle>
              <CardDescription>Les dernières interactions de votre pipeline</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical size={20} /></Button>
          </CardHeader>
          <CardContent className="p-0">
            {activities.length > 0 ? (
              <div className="divide-y divide-white/5">
                {activities.map((activity, i) => (
                  <div key={activity.id || i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                      <ArrowUpRight size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.eventType}</p>
                      <p className="text-xs text-slate-400">{new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                Aucune activité récente disponible.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Niche Distribution */}
        <Card className="glass-card border-none p-0">
          <CardHeader className="p-6 border-b border-white/5">
            <CardTitle className="text-xl text-white">Par Niche</CardTitle>
            <CardDescription>Volume de leads qualifiés</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {niches.length > 0 ? (
              <div className="space-y-6">
                {niches.slice(0, 5).map((niche, i) => (
                  <ProgressItem 
                    key={niche.niche} 
                    label={niche.niche} 
                    value={totalNicheCount > 0 ? Math.round((niche.count / totalNicheCount) * 100) : 0} 
                    color={getNicheColor(i)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                Aucune donnée disponible par niche.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getNicheColor(index: number) {
  const colors = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500"]
  return colors[index % colors.length]
}

function StatCard({ title, value, trend, icon, description, negative = false }: { title: string, value: string, trend: string, icon: React.ReactNode, description: string, negative?: boolean }) {
  return (
    <Card className="glass-card border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-white/5">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${negative ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {trend}
          </span>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
