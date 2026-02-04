import axios from 'axios';
import { create } from 'zustand';

interface Post {
  id: number;
  text: string;
  imageUrl?: string;
  createdAt: string;
  author?: {
    name: string;
    profileImageUrl?: string;
  };
}

interface PostStore {
  posts: Post[];
  pendingPosts: Post[];
  error: string | null;
  loading: boolean;
  pendingMetadata: {
    page: number;
    limit: number;
    total: number;
  };
  fetchPendingPosts: (page?: number, limit?: number) => Promise<void>;
  approvePost: (postId: number) => Promise<void>;
  rejectPost: (postId: number) => Promise<void>;
}

const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  pendingPosts: [],
  error: null,
  loading: false,
  pendingMetadata: {
    page: 0,
    limit: 10,
    total: 0,
  },

  async fetchPendingPosts(page = 1, limit = 10) {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.get('/api/post/pending', {
        params: { page, limit },
      });

      set({
        pendingPosts: data.items,
        pendingMetadata: {
          page: data.page,
          limit: data.limit,
          total: data.total,
        },
        loading: false,
      });

      return;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to fetch pending posts';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async approvePost(postId: number) {
    set({ loading: true, error: null });

    try {
      await axios.post(`/api/post/${postId}/approve`);

      // Remove the approved post from pendingPosts
      const { pendingPosts } = get();
      set({
        pendingPosts: pendingPosts.filter((post) => post.id !== postId),
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to approve post';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async rejectPost(postId: number) {
    set({ loading: true, error: null });

    try {
      await axios.post(`/api/post/${postId}/reject`);

      // Remove the rejected post from pendingPosts
      const { pendingPosts } = get();
      set({
        pendingPosts: pendingPosts.filter((post) => post.id !== postId),
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to reject post';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
}));

export default usePostStore;
