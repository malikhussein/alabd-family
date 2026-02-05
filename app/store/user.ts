import axios from 'axios';
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  metadata: {
    page: number;
    limit: number;
    total: number;
  };
  fetchUsers: (page?: number, limit?: number, role?: string) => Promise<void>;
  toggleRole: (userId: number, newRole: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  metadata: {
    page: 0,
    limit: 10,
    total: 0,
  },

  async fetchUsers(page = 1, limit = 10, role?: string) {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.get('/api/user', {
        params: { page, limit, role },
      });

      set({
        users: data.items || [],
        metadata: {
          page: data.page,
          limit: data.limit,
          total: data.total,
        },
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to fetch users';

      set({
        error: errorMessage,
        users: [],
        loading: false,
      });
      throw error;
    }
  },

  async toggleRole(userId: number, newRole: string) {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post(`/api/user/${userId}/toggle-role`, {
        role: newRole,
      });

      // Update the user in the local state
      const { users } = get();
      set({
        users: users.map((user) =>
          user.id === userId ? { ...user, role: data.role } : user,
        ),
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to toggle user role';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useUserStore;
