import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '@/types';

// Mock API functions
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get users from localStorage
  const usersJSON = localStorage.getItem('users');
  const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
  
  // Find user with matching credentials
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

const mockRegister = async (userData: Omit<User, 'id'>): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing users
  const usersJSON = localStorage.getItem('users');
  const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
  
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

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await mockLogin(email, password);
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const user = await mockRegister(userData);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    return null;
  }
);

// Check if user is already logged in
const getInitialUser = (): User | null => {
  const userJSON = localStorage.getItem('currentUser');
  return userJSON ? JSON.parse(userJSON) : null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;