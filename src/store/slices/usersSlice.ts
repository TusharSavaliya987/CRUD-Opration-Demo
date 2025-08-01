import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState } from '@/types';

// Initialize localStorage with sample data if empty
const initializeUsers = () => {
  const usersJSON = localStorage.getItem('users');
  if (!usersJSON) {
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'Admin',
        dob: '1990-01-15',
        gender: 'Male',
        status: true,
        profileImage: null,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'User',
        dob: '1992-05-20',
        gender: 'Female',
        status: true,
        profileImage: null,
      },
      {
        id: '3',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        password: 'password123',
        role: 'Manager',
        dob: '1985-11-08',
        gender: 'Male',
        status: false,
        profileImage: null,
      },
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
    return sampleUsers;
  }
  return JSON.parse(usersJSON);
};

// Mock API functions
const mockFetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get users from localStorage
  return initializeUsers();
};

const mockAddUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing users
  const users: User[] = await mockFetchUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  // Create new user with ID
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  };
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  
  return newUser;
};

const mockUpdateUser = async (userData: User): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing users
  const users: User[] = await mockFetchUsers();
  
  // Check if email already exists (for another user)
  const emailExists = users.some(
    user => user.email === userData.email && user.id !== userData.id
  );
  
  if (emailExists) {
    throw new Error('Email already exists');
  }
  
  // Update user
  const updatedUsers = users.map(user => 
    user.id === userData.id ? userData : user
  );
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  return userData;
};

const mockDeleteUser = async (userId: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing users
  const users: User[] = await mockFetchUsers();
  
  // Filter out the user to delete
  const updatedUsers = users.filter(user => user.id !== userId);
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  return userId;
};

const mockDeleteMultipleUsers = async (userIds: string[]): Promise<string[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing users
  const users: User[] = await mockFetchUsers();
  
  // Filter out the users to delete
  const updatedUsers = users.filter(user => !userIds.includes(user.id));
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  return userIds;
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await mockFetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      return await mockAddUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: User, { rejectWithValue }) => {
    try {
      return await mockUpdateUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await mockDeleteUser(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteMultipleUsers = createAsyncThunk(
  'users/deleteMultipleUsers',
  async (userIds: string[], { rejectWithValue }) => {
    try {
      return await mockDeleteMultipleUsers(userIds);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Helper function to filter and sort users
const filterAndSortUsers = (
  users: User[],
  searchTerm: string,
  roleFilter: string,
  sortField: string,
  sortDirection: 'asc' | 'desc'
): User[] => {
  // First filter
  let result = [...users];
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
  }
  
  if (roleFilter && roleFilter !== 'All') {
    result = result.filter(user => user.role === roleFilter);
  }
  
  // Then sort
  if (sortField) {
    result.sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }
  
  return result;
};

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 5,
  sortField: 'name',
  sortDirection: 'asc',
  searchTerm: '',
  roleFilter: 'All',
  selectedUsers: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      // If clicking the same field, toggle direction
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
      
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
      
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
      
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    },
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    selectAllUsers: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        // Get current page users
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const currentPageUsers = state.filteredUsers.slice(startIndex, endIndex);
        
        // Select all users on current page
        state.selectedUsers = currentPageUsers.map(user => user.id);
      } else {
        state.selectedUsers = [];
      }
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
      
      // Apply filters and sorting
      state.filteredUsers = filterAndSortUsers(
        action.payload,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Add User
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      
      // Apply filters and sorting
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    });
    
    // Update User
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      
      // Apply filters and sorting
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
    });
    
    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
      
      // Apply filters and sorting
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages and adjust current page if needed
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      if (state.currentPage > state.totalPages && state.totalPages > 0) {
        state.currentPage = state.totalPages;
      }
    });
    
    // Delete Multiple Users
    builder.addCase(deleteMultipleUsers.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.users = state.users.filter(user => !action.payload.includes(user.id));
      state.selectedUsers = [];
      
      // Apply filters and sorting
      state.filteredUsers = filterAndSortUsers(
        state.users,
        state.searchTerm,
        state.roleFilter,
        state.sortField,
        state.sortDirection
      );
      
      // Update total pages and adjust current page if needed
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      if (state.currentPage > state.totalPages && state.totalPages > 0) {
        state.currentPage = state.totalPages;
      }
    });
  },
});

export const {
  setCurrentPage,
  setSortField,
  setSearchTerm,
  setRoleFilter,
  toggleUserSelection,
  selectAllUsers,
  clearSelectedUsers,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;