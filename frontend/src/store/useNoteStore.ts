import { create } from "zustand";
import api from "@/lib/api";

interface Note {
  _id: string;
  title: string;
  content: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  loading: false,
  error: null,
  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/notes");
      set({ notes: data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch notes",
        loading: false,
      });
    }
  },
  addNote: async (title, content) => {
    try {
      const { data } = await api.post("/notes", { title, content });
      set((state) => ({ notes: [data, ...state.notes] }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to add note" });
    }
  },
  updateNote: async (id, title, content) => {
    try {
      const { data } = await api.put(`/notes/${id}`, { title, content });
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? data : n)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update note" });
    }
  },
  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete note" });
    }
  },
}));
