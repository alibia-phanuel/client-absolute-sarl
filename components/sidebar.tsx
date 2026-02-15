"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  FileText,
  Calendar,
  Shield,
  List,
  Receipt,
  FileUp,
  LogOut,
  Users,
} from "lucide-react";

const menuSections = [
  {
    label: "Vue Générale",
    items: [
      { name: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { name: "Partie Client", url: "/", icon: Users },
    ],
  },
  {
    label: "Assistant IA",
    items: [{ name: "Documents PDF", url: "/ia-pdf-document", icon: FileUp }],
  },
  {
    label: "Blogs",
    items: [{ name: "Tous les articles", url: "/blogs", icon: List }],
  },
  {
    label: "Contenus Clients",
    items: [
      { name: "Messages", url: "/messages", icon: FileText },
      { name: "Les devis", url: "/devis", icon: Receipt },
      { name: "Les Rendez-vous", url: "/rendez-vous", icon: Calendar },
    ],
  },
  {
    label: "Utilisateurs",
    items: [
      { name: "Liste des utilisateurs", url: "/utilisateurs", icon: Users },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push("/login");
  };

  if (!user) return null;

  const isRouteActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 font-bold text-lg flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Admin Panel
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = isRouteActive(item.url);

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url as any}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
