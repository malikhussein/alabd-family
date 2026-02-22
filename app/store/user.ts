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
  myData: User | null;
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
  getMe: () => Promise<void>;
  updateProfilePicture: (fileImage: File) => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  myData: null,
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

  async getMe() {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get("/api/user/me");
      console.log(data);

      set({ myData: data.user, loading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch user data";
      set({ error: errorMessage, myData: null, loading: false });
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
  async updateProfilePicture(fileImage: File) {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      formData.append("file", fileImage);

      const { data } = await axios.post(
        `/api/user/me/profile-picture`,
        formData,
      ); // no headers

      const { myData } = get();
      set({
        myData: myData
          ? { ...myData, profileImageUrl: data.profileImageUrl }
          : null,
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update profile picture";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));

export default useUserStore;
