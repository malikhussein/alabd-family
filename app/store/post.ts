import axios from "axios";
import { create } from "zustand";

interface Post {
  id: number;
  text: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  imageUrl?: string;
  createdAt: string;
  author?: {
    name: string;
    profileImageUrl?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PostStore {
  posts: Post[];
  Comment: Comment[];
  pendingPosts: Post[];
  error: string | null;
  loading: boolean;
  pendingMetadata: {
    page: number;
    limit: number;
    total: number;
  };
  fetchPendingPosts: (page?: number, limit?: number) => Promise<void>;
  fetchPosts: () => Promise<void>;
  approvePost: (postId: number) => Promise<void>;
  rejectPost: (postId: number) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  unLikePost: (postId: number) => Promise<void>;
  createComment: (data: { postId: number; content: string }) => Promise<void>;
  showComments: (postId: number) => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
}

const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  Comment: [],
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
      const { data } = await axios.get("/api/post/pending", {
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
        : "Failed to fetch pending posts";

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async fetchPosts(page = 1, limit = 10) {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get("/api/post", {
        params: { page, limit },
      });
      console.log(data);

      set({ posts: data.items, loading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch posts";
      set({ error: errorMessage, loading: false });
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
        : "Failed to approve post";

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
        : "Failed to reject post";

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async createPost(formData: FormData) {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchPosts();
      set({ loading: false }); // Add this
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to create post";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async likePost(postId: number) {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/post/${postId}/like`);
      await get().fetchPosts();
      console.log(response);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to like post";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async unLikePost(postId: number) {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/post/${postId}/like`);
      await get().fetchPosts();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to unlike post";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async createComment(data: { postId: number; content: string }) {
    set({ loading: true, error: null });
    try {
      await axios.post(`/api/post/${data.postId}/comments`, data);
      // Reload comments after creating a new one
      await get().showComments(data.postId);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to create comment";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async showComments(postId: number) {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`/api/post/${postId}/comments`);
      const comments = data.items.map(
        (comment: {
          id: string;
          content: string;
          user: { id: number; name: string; email?: string };
          createdAt: string;
          updatedAt: string;
        }) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
        }),
      );
      set({ loading: false, Comment: comments });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch comments";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));

export default usePostStore;
