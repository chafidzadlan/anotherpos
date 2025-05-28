import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, User as UserIcon } from "lucide-react";
import { UserActionsDropdown } from "@/components/dashboard/admin/UserActionsDropdown";
import { User } from "@/lib/types/types";

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (userId: number, userName: string) => void;
  deleteLoading: number | null;
}

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  cashier: "bg-green-100 text-green-800 border-green-200",
  inventory: "bg-orange-100 text-orange-800 border-orange-200",
};

export function UserCard({
  user,
  currentUserId,
  onEdit,
  onDelete,
  deleteLoading,
}: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-slate-800">{user.name}</h3>
            <Badge className={`text-xs ${roleColors[user.role]}`}>
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <UserActionsDropdown
        user={user}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        deleteLoading={deleteLoading}
      />
    </div>
  );
}