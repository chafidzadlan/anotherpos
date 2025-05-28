"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, UserPlus, User as UserIcon, Mail, Calendar } from "lucide-react";
import { User } from "@/lib/types/types";
import { usePOSToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserFormDialog } from "@/components/dashboard/admin/UserFormDialog";
import { UserActionsDropdown } from "@/components/dashboard/admin/UserActionsDropdown";
import { Pagination } from "@/components/pagination";
import { PaginationInfo } from "@/components/pagination-info";

const ITEMS_PER_PAGE = 5;

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  cashier: "bg-green-100 text-green-800 border-green-200",
  inventory: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { toast } = usePOSToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowDialog(true);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (session?.user?.id === userId.toString()) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600 mt-1">Manage all system users and their roles</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {searchTerm ? "No users found matching your search." : "No users found."}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{user.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${roleColors[user.role]}`}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActionsDropdown
                            user={user}
                            currentUserId={session?.user?.id}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            deleteLoading={deleteLoading}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-6">
                <PaginationInfo
                  currentPage={currentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredUsers.length}
                  itemName="users"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <UserFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}