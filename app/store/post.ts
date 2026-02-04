import { create } from 'zustand';

const usePostStore = create((set, get) => ({
  posts: [],
  error: null,
  loading: false,
}));

export default usePostStore;
