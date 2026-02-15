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
}));

export default useFamilyDataStore;
