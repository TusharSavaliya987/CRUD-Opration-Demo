export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  dob: string;
  gender: string;
  status: boolean;
  profileImage: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  roleFilter: string;
  selectedUsers: string[];
}