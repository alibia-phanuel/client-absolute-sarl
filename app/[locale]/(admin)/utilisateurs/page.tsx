"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Filter, RefreshCw, Search, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { User, UserRole } from "@/types/user.types";
import { getUsers } from "@/lib/users.api";
import { UsersTable } from "@/components/users/UsersTable";
import { AddUserModal } from "@/components/users/AddUserFormData";

export default function UsersPage() {
  const t = useTranslations();
  const tUsers = useTranslations("users");

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // ✅ FIX: Fonction pour charger les utilisateurs
  const fetchUsers = async (role?: UserRole | "ALL") => {
    setIsLoading(true);
    try {
      // ✅ Passer undefined si "ALL", sinon passer le rôle
      const result = await getUsers(role === "ALL" ? undefined : role);
      setUsers(result.data);
      setFilteredUsers(result.data);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Charger depuis l'API avec le filtre de rôle
    fetchUsers(roleFilter);
  }, [roleFilter]);

  // Filtrer localement uniquement par recherche
  // Le filtre par rôle est géré côté serveur
  useEffect(() => {
    let filtered = [...users];

    // Filtre par recherche (local)
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRefresh = () => {
    fetchUsers(roleFilter);
    toast.success(tUsers("refreshed"));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tUsers("title")}
            </h1>
            <p className="text-muted-foreground">{tUsers("description")}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4 mb-8"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tUsers("totalUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tUsers("roles.admin")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "ADMIN").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tUsers("roles.employe")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "EMPLOYE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tUsers("roles.client")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "CLIENT").length}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {tUsers("filters")}
            </CardTitle>
            <CardDescription>{tUsers("filtersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={tUsers("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre par rôle */}
              <Select
                value={roleFilter}
                onValueChange={(value) =>
                  setRoleFilter(value as UserRole | "ALL")
                }
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{tUsers("allRoles")}</SelectItem>
                  <SelectItem value="CLIENT">
                    {tUsers("roles.client")}
                  </SelectItem>
                  <SelectItem value="EMPLOYE">
                    {tUsers("roles.employe")}
                  </SelectItem>
                  <SelectItem value="ADMIN">{tUsers("roles.admin")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Bouton Ajouter */}
              <Button
                onClick={() => setAddModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {tUsers("addUser")}
              </Button>

              {/* Bouton Refresh */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {tUsers("refresh")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {tUsers("usersList")} ({filteredUsers.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable
              users={filteredUsers}
              isLoading={isLoading}
              onRefresh={fetchUsers}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Modal */}
      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => fetchUsers(roleFilter)}
      />
    </div>
  );
}
