import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Pencil, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { format } from 'date-fns';
import { AppDispatch, RootState } from '@/store';
import { User } from '@/types';
import {
  setSortField,
  toggleUserSelection,
  selectAllUsers,
  deleteUser,
  deleteMultipleUsers,
} from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { downloadCSV } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UserTableProps {
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

const UserTable = ({ onViewUser, onEditUser }: UserTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const {
    filteredUsers,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    selectedUsers,
  } = useSelector((state: RootState) => state.users);
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current page users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Check if all users on current page are selected
  const areAllSelected = currentUsers.length > 0 && 
    currentUsers.every(user => selectedUsers.includes(user.id));

  // Handle sort
  const handleSort = (field: string) => {
    dispatch(setSortField(field));
  };

  // Handle select all
  const handleSelectAll = () => {
    dispatch(selectAllUsers(!areAllSelected));
  };

  // Handle single selection
  const handleSelect = (userId: string) => {
    dispatch(toggleUserSelection(userId));
  };

  // Handle delete confirmation
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Handle bulk delete confirmation
  const handleBulkDeleteClick = () => {
    if (selectedUsers.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();
      toast({
        title: 'User deleted',
        description: `${userToDelete.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // Handle bulk delete confirmation
  const handleConfirmBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteMultipleUsers(selectedUsers)).unwrap();
      toast({
        title: 'Users deleted',
        description: `${selectedUsers.length} users have been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    downloadCSV(filteredUsers, 'users-data');
    toast({
      title: 'Export successful',
      description: 'User data has been exported to CSV.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User List</h2>
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <Checkbox
                    checked={areAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 -ml-4 font-medium"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 -ml-4 font-medium"
                  >
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  DOB
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelect(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                    <td className="p-4 align-middle font-medium">{user.name}</td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">{user.role}</td>
                    <td className="p-4 align-middle">
                      {user.dob ? format(new Date(user.dob), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewUser(user)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditUser(user)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.length} users? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedUsers.length} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;