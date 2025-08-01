import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { User } from '@/types';
import {
  fetchUsers,
  addUser,
  updateUser,
} from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserTable from '@/components/users/user-table';
import UserForm from '@/components/users/user-form';
import UserDetail from '@/components/users/user-detail';
import UserFilter from '@/components/users/user-filter';
import Pagination from '@/components/users/pagination';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { isLoading } = useSelector((state: RootState) => state.users);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = async (userData: any) => {
    setIsSubmitting(true);
    try {
      await dispatch(addUser(userData)).unwrap();
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'User added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: typeof error === 'string' ? error : 'Failed to add user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData: User) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateUser(userData)).unwrap();
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: typeof error === 'string' ? error : 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>

      </div>

      {isAuthenticated ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <UserFilter />
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <UserTable
                onViewUser={handleViewUser}
                onEditUser={handleEditUser}
              />
              <Pagination />
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            Please login to access the user management features.
          </p>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={handleAddUser}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleUpdateUser}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetail user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;