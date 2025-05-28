import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types/types";
import { Edit, Loader2, MoreVertical, Trash2 } from "lucide-react";

interface UserActionsDropdownProps {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (userId: number, userName: string) => void;
  deleteLoading: number | null;
}

export function UserActionsDropdown({
  user,
  currentUserId,
  onEdit,
  onDelete,
  deleteLoading,
}: UserActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const isCurrentUser = currentUserId === user.id.toString();
  const isDeleting = deleteLoading === user.id;

  const handleEdit = () => {
    onEdit(user);
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete(user.id, user.name);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-slate-100"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" /> Edit User
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={isCurrentUser || isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          {isDeleting ? "Deleting..." : "Delete User"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}