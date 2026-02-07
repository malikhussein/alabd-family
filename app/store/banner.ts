import axios from 'axios';
import { create } from 'zustand';

interface Banner {
  id: number;
  text: string;
  imageKey: string;
  imageUrl: string;
}

interface BannerStore {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  fetchBanners: () => Promise<void>;
  createBanner: (formData: FormData) => Promise<void>;
  updateBanner: (bannerId: number, formData: FormData) => Promise<void>;
  deleteBanner: (bannerId: number) => Promise<void>;
}

const useBannerStore = create<BannerStore>((set, get) => ({
  banners: [],
  loading: false,
  error: null,

  async fetchBanners() {
    set({ loading: true, error: null });

    try {
      const response = await axios.get('/api/banner');
      set({ banners: response.data.banners, loading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to fetch banners';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async createBanner(formData: FormData) {
    set({ loading: true, error: null });

    try {
      const response = await axios.post('/api/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add the new banner to the list
      const { banner } = response.data;
      const { banners } = get();
      set({
        banners: [...banners, banner],
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to create banner';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async updateBanner(bannerId: number, formData: FormData) {
    set({ loading: true, error: null });

    try {
      const response = await axios.patch(`/api/banner/${bannerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the banner in the list
      const updatedBanner = response.data.banner;
      const { banners } = get();
      set({
        banners: banners.map((b) => (b.id === bannerId ? updatedBanner : b)),
        loading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to update banner';

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  async deleteBanner(bannerId: number) {
    set({ loading: true, error: null });

    try {
      await axios.delete(`/api/banner/${bannerId}`);

      // Remove the banner from the list
      const { banners } = get();
      set({
        banners: banners.filter((b) => b.id !== bannerId),
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to delete banner';

      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));

export default useBannerStore;
