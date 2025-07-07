import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  sidebarOpen: boolean;
  currentUser: {
    name: string;
    role: string;
  } | null;
  notifications: {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
  }[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
}

const initialState: DashboardState = {
  sidebarOpen: false,
  currentUser: null,
  notifications: [],
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentUser: (state, action: PayloadAction<DashboardState['currentUser']>) => {
      state.currentUser = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<DashboardState['notifications'][0], 'read'>>
    ) => {
      state.notifications.push({ ...action.payload, read: false });
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
});

export const {
  toggleSidebar,
  setCurrentUser,
  addNotification,
  markNotificationAsRead,
  updateStats,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
