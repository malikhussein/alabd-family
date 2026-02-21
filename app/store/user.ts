import axios from "axios";
import { create } from "zustand";

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
  fetchUsers: (
    page?: number,
    limit?: number,
    role?: string,
    keyword?: string,
  ) => Promise<void>;
  toggleRole: (userId: number, newRole: string) => Promise<void>;
  mostActiveUsers: () => Promise<void>;
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

  async fetchUsers(page = 1, limit = 10, role?: string, keyword?: string) {
    set({ loading: true, error: null });

    try {
      const params: {
        page: number;
        limit: number;
        role?: string;
        keyword?: string;
      } = { page, limit };
      if (role) {
        params.role = role;
      }
      if (keyword) {
        params.keyword = keyword;
      }

      const { data } = await axios.get("/api/user", { params });

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
        : "Failed to fetch users";

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
      const { data } = await axios.patch(`/api/user/${userId}/toggle-role`, {
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
        : "Failed to toggle user role";

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async mostActiveUsers() {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get("/api/user/most-active");
      set({
        users: data.users || [],
        metadata: {
          page: 1,
          limit: data.users.length,
          total: data.users.length,
        },
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch most active users";
      set({ error: errorMessage, users: [], loading: false });
      throw error;
    }
  },

  // Needt to Refactor this function to update the user in the local state instead of refetching all users
  async updateProfilePicture (  userId: number, imageUrl: string) {
    set({ loading: true, error: null });
    const response = await axios.post(`/api/user/me/profile-picture`, {
      imageUrl,
    });
    const updatedUser = response.data;
    const { users } = get();
    set({
      users: users.map((user) =>
        user.id === userId ? { ...user, profileImageUrl: updatedUser.profileImageUrl } : user,
      ),
      loading: false,
    });
  }

}));

export default useUserStore;
