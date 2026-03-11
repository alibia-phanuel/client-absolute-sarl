"use client";

/**
 * 🏠 Dashboard Admin — Absolute SARL
 *
 * Vue d'ensemble avec :
 * - KPIs : utilisateurs, diagnostics, messages, rendez-vous
 * - Activité récente (derniers diagnostics + messages)
 * - Stats rapides par destination
 * - Raccourcis vers les sections
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  MessageSquare,
  CalendarClock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthStore } from "@/store/authStore";
import { getUsers } from "@/lib/users.api";
import { getBlogs } from "@/lib/blogs.api";
import { getAllRendezVous } from "@/lib/Rendezvous.api";
import { getContactMessages, getContactMessagesStats } from "@/lib/contact.api";
import { getDiagnostics, getDiagnosticStats } from "@/lib/diagnostic.admin.api";
import type { DiagnosticStats } from "@/types/Diagnostic.types";
import { DestinationFlag } from "@/components/ui/CountryFlag";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES LOCAUX
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardStats {
  users: { total: number; clients: number; employes: number };
  diagnostics: DiagnosticStats | null;
  messages: { total: number; new: number; inProgress: number };
  rendezvous: { total: number; pending: number; approved: number };
  blogs: { total: number };
}

interface RecentDiagnostic {
  id: string;
  firstName: string;
  lastName: string;
  destination: string;
  status: string;
  createdAt: string;
}

interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS VISUELS — hors composant pour stabilité
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_DIAG_COLORS: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  READ: "bg-purple-500/10 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-orange-500/10 text-orange-700 border-orange-200",
  TREATED: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  RESOLVED: "bg-green-500/10 text-green-700 border-green-200",
  ARCHIVED: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const STATUS_MSG_COLORS: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  READ: "bg-purple-500/10 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-orange-500/10 text-orange-700 border-orange-200",
  RESOLVED: "bg-green-500/10 text-green-700 border-green-200",
  ARCHIVED: "bg-gray-500/10 text-gray-600 border-gray-200",
};

// Carte KPI réutilisable
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  subColor = "text-muted-foreground",
  iconBg = "bg-primary/10 text-primary",
  delay = 0,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  subColor?: string;
  iconBg?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className={
          onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
        }
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span>{label}</span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconBg}`}
            >
              <Icon className="h-4 w-4" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton KPI
function KpiSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const tD = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuthStore();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, clients: 0, employes: 0 },
    diagnostics: null,
    messages: { total: 0, new: 0, inProgress: 0 },
    rendezvous: { total: 0, pending: 0, approved: 0 },
    blogs: { total: 0 },
  });
  const [recentDiagnostics, setRecentDiagnostics] = useState<
    RecentDiagnostic[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ── Chargement de toutes les données en parallèle ─────────────────────────
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [
        usersRes,
        usersClients,
        blogsRes,
        rdvRes,
        msgStatsRes,
        msgRes,
        diagStatsRes,
        diagRes,
      ] = await Promise.allSettled([
        getUsers(),
        getUsers("CLIENT"),
        getBlogs({ page: 1, limit: 1 }),
        getAllRendezVous({ page: 1, limit: 5 }),
        getContactMessagesStats(),
        getContactMessages({ page: 1, limit: 5 }),
        getDiagnosticStats(),
        getDiagnostics({
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ]);

      // ── Users ──────────────────────────────────────────────────────────────
      const totalUsers =
        usersRes.status === "fulfilled"
          ? (usersRes.value?.data?.length ?? 0)
          : 0;
      const totalClients =
        usersClients.status === "fulfilled"
          ? (usersClients.value?.data?.length ?? 0)
          : 0;

      // ── Blogs ──────────────────────────────────────────────────────────────
      const totalBlogs =
        blogsRes.status === "fulfilled"
          ? (blogsRes.value?.data?.length ??
            blogsRes.value?.data?.length ??
            0)
          : 0;

      // ── Rendez-vous ────────────────────────────────────────────────────────
      const rdvData = rdvRes.status === "fulfilled" ? rdvRes.value : null;
      const rdvList = rdvData?.data ?? [];
      const rdvTotal = rdvData?.pagination?.total ?? rdvList.length;
      const rdvPending = rdvList.filter(
        (r: any) => r.status === "PENDING",
      ).length;
      const rdvApproved = rdvList.filter(
        (r: any) => r.status === "APPROVED",
      ).length;

      // ── Messages ───────────────────────────────────────────────────────────
      const msgStats =
        msgStatsRes.status === "fulfilled" ? msgStatsRes.value?.data : null;
      const msgList =
        msgRes.status === "fulfilled" ? (msgRes.value?.data ?? []) : [];

      setRecentMessages(
        msgList.slice(0, 5).map((m: any) => ({
          id: m.id,
          name: m.name,
          subject: m.subject,
          status: m.status,
          createdAt: m.createdAt,
        })),
      );

      // ── Diagnostics ────────────────────────────────────────────────────────
      const diagStats =
        diagStatsRes.status === "fulfilled" ? diagStatsRes.value : null;
      const diagList =
        diagRes.status === "fulfilled" ? (diagRes.value?.data ?? []) : [];

      setRecentDiagnostics(
        diagList.slice(0, 5).map((d: any) => ({
          id: d.id,
          firstName: d.firstName,
          lastName: d.lastName,
          destination: d.destination,
          status: d.status,
          createdAt: d.createdAt,
        })),
      );

      setStats({
        users: {
          total: totalUsers,
          clients: totalClients,
          employes: totalUsers - totalClients,
        },
        diagnostics: diagStats,
        messages: {
          total: msgStats?.total ?? 0,
          new: msgStats?.byStatus?.new ?? 0,
          inProgress: msgStats?.byStatus?.inProgress ?? 0,
        },
        rendezvous: {
          total: rdvTotal,
          pending: rdvPending,
          approved: rdvApproved,
        },
        blogs: { total: totalBlogs },
      });

      setLastRefresh(new Date());
    } catch {
      toast.error(tD("fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const nav = (path: string) => router.push(`/${locale}${path}`);
  const fmt = (date: string) =>
    format(new Date(date), "d MMM yyyy", { locale: dateLocale });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tD("greeting")}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {tD("subtitle")} —{" "}
            {format(lastRefresh, "HH:mm", { locale: dateLocale })}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchAll}
          disabled={isLoading}
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {tD("refresh")}
        </Button>
      </motion.div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => <KpiSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              icon={Users}
              label={tD("kpiUsers")}
              value={stats.users.total}
              sub={tD("kpiUsersClients", { count: stats.users.clients })}
              iconBg="bg-violet-500/10 text-violet-600"
              delay={0}
              onClick={() => nav("/utilisateurs")}
            />
            <KpiCard
              icon={ClipboardList}
              label={tD("kpiDiagnostics")}
              value={stats.diagnostics?.total ?? 0}
              sub={tD("kpiDiagnosticsNew", {
                count: stats.diagnostics?.newToday ?? 0,
              })}
              subColor={
                stats.diagnostics?.newToday
                  ? "text-blue-600 font-medium"
                  : "text-muted-foreground"
              }
              iconBg="bg-blue-500/10 text-blue-600"
              delay={0.05}
              onClick={() => nav("/diagnostic")}
            />
            <KpiCard
              icon={MessageSquare}
              label={tD("kpiMessages")}
              value={stats.messages.total}
              sub={tD("kpiMessagesNew", { count: stats.messages.new })}
              subColor={
                stats.messages.new
                  ? "text-orange-600 font-medium"
                  : "text-muted-foreground"
              }
              iconBg="bg-orange-500/10 text-orange-600"
              delay={0.1}
              onClick={() => nav("/messages")}
            />
            <KpiCard
              icon={CalendarClock}
              label={tD("kpiRendezvous")}
              value={stats.rendezvous.total}
              sub={tD("kpiRendezvousPending", {
                count: stats.rendezvous.pending,
              })}
              subColor={
                stats.rendezvous.pending
                  ? "text-yellow-600 font-medium"
                  : "text-muted-foreground"
              }
              iconBg="bg-yellow-500/10 text-yellow-600"
              delay={0.15}
              onClick={() => nav("/rendez-vous")}
            />
            <KpiCard
              icon={BookOpen}
              label={tD("kpiBlogs")}
              value={stats.blogs.total}
              iconBg="bg-green-500/10 text-green-600"
              delay={0.2}
              onClick={() => nav("/blogs")}
            />
          </>
        )}
      </div>

      {/* ── Ligne principale : Activité récente + Destinations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Derniers diagnostics ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                  {tD("recentDiagnostics")}
                </CardTitle>
                <CardDescription>{tD("recentDiagnosticsDesc")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => nav("/diagnostic")}
                className="text-xs gap-1"
              >
                {tD("viewAll")}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : recentDiagnostics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {tD("noDiagnostics")}
                </p>
              ) : (
                recentDiagnostics.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                        {d.firstName[0]}
                        {d.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {d.firstName} {d.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <DestinationFlag
                            destination={d.destination}
                            size={14}
                          />
                          {fmt(d.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${STATUS_DIAG_COLORS[d.status] ?? ""}`}
                    >
                      {tD(`diagStatus${d.status}`)}
                    </Badge>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Répartition par destination ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                {tD("byDestination")}
              </CardTitle>
              <CardDescription>{tD("byDestinationDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))
              ) : !stats.diagnostics ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  —
                </p>
              ) : (
                Object.entries(stats.diagnostics.byDestination).map(
                  ([dest, count]) => {
                    const total = stats.diagnostics!.total || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={dest} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5">
                            <DestinationFlag destination={dest} size={16} />
                            {tD(`dest${dest}`)}
                          </span>
                          <span className="font-medium text-xs">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    );
                  },
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Messages récents + Accès rapides ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Derniers messages ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  {tD("recentMessages")}
                </CardTitle>
                <CardDescription>{tD("recentMessagesDesc")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => nav("/messages")}
                className="text-xs gap-1"
              >
                {tD("viewAll")}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {tD("noMessages")}
                </p>
              ) : (
                recentMessages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-semibold text-orange-600 flex-shrink-0">
                        {m.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.subject} · {fmt(m.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${STATUS_MSG_COLORS[m.status] ?? ""}`}
                    >
                      {tD(`msgStatus${m.status}`)}
                    </Badge>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Accès rapides ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{tD("quickAccess")}</CardTitle>
              <CardDescription>{tD("quickAccessDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  icon: ClipboardList,
                  label: tD("goDiagnostics"),
                  sub: stats.diagnostics?.newToday
                    ? tD("newTodayBadge", { count: stats.diagnostics.newToday })
                    : undefined,
                  path: "/diagnostic",
                  color: "text-blue-600",
                  bg: "hover:bg-blue-50",
                },
                {
                  icon: MessageSquare,
                  label: tD("goMessages"),
                  sub: stats.messages.new
                    ? tD("newBadge", { count: stats.messages.new })
                    : undefined,
                  path: "/messages",
                  color: "text-orange-600",
                  bg: "hover:bg-orange-50",
                },
                {
                  icon: CalendarClock,
                  label: tD("goRendezvous"),
                  sub: stats.rendezvous.pending
                    ? tD("pendingBadge", { count: stats.rendezvous.pending })
                    : undefined,
                  path: "/rendez-vous",
                  color: "text-yellow-600",
                  bg: "hover:bg-yellow-50",
                },
                {
                  icon: Users,
                  label: tD("goUsers"),
                  path: "/utilisateurs",
                  color: "text-violet-600",
                  bg: "hover:bg-violet-50",
                },
                {
                  icon: BookOpen,
                  label: tD("goBlogs"),
                  path: "/blogs",
                  color: "text-green-600",
                  bg: "hover:bg-green-50",
                },
              ].map(({ icon: Icon, label, sub, path, color, bg }) => (
                <button
                  key={path}
                  onClick={() => nav(path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${bg} group`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-medium">{label}</span>
                    {sub && (
                      <span className={`text-xs font-semibold ${color}`}>
                        {sub}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Diagnostics par statut (admin only) ── */}
      {user?.role === "ADMIN" && stats.diagnostics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {tD("diagByStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Object.entries(stats.diagnostics.byStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-3 rounded-xl border bg-muted/30 space-y-1"
                    >
                      <div className="text-2xl font-bold">{count}</div>
                      <div
                        className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${STATUS_DIAG_COLORS[status]}`}
                      >
                        {tD(`diagStatus${status}`)}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
