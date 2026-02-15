import { create } from 'zustand';

interface FamilyData {
  id: number;
  familyName: string;
  familyInfo?: string;
}

interface FamilyDataStore {
  familiesData: FamilyData[] | null;
  familyData: FamilyData | null;
  loading: boolean;
  error: string | null;
  fetchFamilyData: () => Promise<void>;
  fetchOneFamilyData: (id: number) => Promise<void>;
  updateFamilyData: (id: number, familyInfo: string) => Promise<void>;
}

const useFamilyDataStore = create<FamilyDataStore>((set) => ({
  familiesData: [],
  familyData: null,
  loading: false,
  error: null,

  async fetchFamilyData() {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/family-data');
      if (!response.ok) {
        throw new Error('Failed to fetch family data');
      }
      const data = await response.json();
      set({ familiesData: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },
  async fetchOneFamilyData(id: number) {
    set({ loading: true, error: null, familyData: null });

    try {
      const response = await fetch(`/api/family-data/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch family data');
      }
      const data = await response.json();
      set({ familyData: data.familyData, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },

  async updateFamilyData(id: number, familyInfo: string) {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`/api/family-data/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyInfo }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update family data');
      }
      const updatedFamilyData = await response.json();
      set({ loading: false, familyData: updatedFamilyData.familyData });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },
}));

export default useFamilyDataStore;
