import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { setSearchTerm, setRoleFilter } from '@/store/slices/usersSlice';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, roleFilter } = useSelector((state: RootState) => state.users);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleRoleFilterChange = (value: string) => {
    dispatch(setRoleFilter(value));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className="w-full md:w-[200px]">
        <Select
          value={roleFilter}
          onValueChange={handleRoleFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserFilter;