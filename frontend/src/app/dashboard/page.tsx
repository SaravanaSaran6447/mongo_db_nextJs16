"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNoteStore } from "@/store/useNoteStore";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Loader2,
  Sparkles,
  Filter,
  PenSquare,
  ShieldCheck,
  Zap,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AppLayout from "@/components/layouts/AppLayout";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { notes, fetchNotes, addNote, loading } = useNoteStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchNotes();
    }
  }, [user, fetchNotes, router]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    // Validations
    if (cleanTitle.length < 3) return toast.error("Title must be at least 3 characters");
    if (cleanTitle.length > 50) return toast.error("Title cannot exceed 50 characters");
    if (cleanContent.length < 5) return toast.error("Content must be at least 5 characters");

    try {
      await addNote(cleanTitle, cleanContent);
      toast.success("Thought captured in your digital stream");
      setTitle("");
      setContent("");
      setIsAdding(false);
    } catch (err) {
      toast.error("Failed to archive your thought");
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <AppLayout onNewNote={() => setIsAdding(true)}>
      <div className="pb-24">
        {/* Cinematic Hero Header */}
        <section className="relative overflow-hidden border-b border-white/5 py-12 md:py-20 lg:py-24">

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full border border-sky-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-400">
                <Zap className="h-3 w-3" />
                <span>Synchronized Stream</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
                Elevate your <br />
                <span className="text-sky-500 underline decoration-sky-800/30 underline-offset-8">
                  thoughts.
                </span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed md:text-xl">
                Welcome back,{" "}
                <span className="text-white">{user.fullName.split(" ")[0]}</span>
                . You have {notes.length} thoughts archived in your digital vault.
              </p>
            </div>

            <div className="flex w-full flex-col space-y-4 md:w-auto">
              <div className="flex items-center space-x-3">
                <div className="group relative flex-1 md:flex-none">
                  <Search className="text-muted-foreground absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-sky-400" />
                  <Input
                    placeholder="Search your consciousness..."
                    className="h-14 w-full rounded-2xl border-white/10 bg-white/5 pl-12 text-lg transition-all focus:border-sky-500/50 md:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setIsAdding(true)}
                  className="h-14 rounded-2xl bg-sky-600 px-8 text-lg font-bold shadow-2xl shadow-sky-900/40 transition-all hover:bg-sky-500 hover:shadow-sky-500/20"
                >
                  <Plus className="mr-2 h-6 w-6" />
                  Capture
                </Button>
              </div>

              {user.role === "admin" && (
                <div
                  onClick={() => router.push("/admin")}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:border-amber-500/40 hover:bg-amber-500/10"
                >
                  <div className="flex items-center space-x-3 text-amber-500">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Admin Console
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-500/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutGrid className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-bold tracking-tight">Your Stream</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-white">
              Latest
            </button>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <button className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-white">
              A-Z
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-32">
            <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
            <span className="text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">
              Synchronizing...
            </span>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/5 py-40 text-center transition-colors hover:bg-white/10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5">
              <PenSquare className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              The stream is silent.
            </h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-lg font-medium leading-relaxed">
              Your digital conscious is empty. Start your journey by capturing
              your first meaningful thought.
            </p>
          </div>
        )}
      </div>

      {/* Note Creation Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogHeader>
          <div className="mb-2 flex items-center space-x-2 text-sky-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              New Inspiration
            </span>
          </div>
          <DialogTitle>Capture Your Thought</DialogTitle>
          <DialogDescription>
            Document your stream of consciousness in the secure vault.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddNote} className="space-y-6 px-8 py-8">
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-white/40">
              Title / Summary
            </label>
            <Input
              placeholder="What's this about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 rounded-2xl border-white/10 bg-white/5 text-lg font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-white/40">
              Content / Details
            </label>
            <textarea
              placeholder="Start your stream here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 rounded-xl bg-sky-600 px-10 font-bold transition-all hover:bg-sky-500"
            >
              Archieve Thought
            </Button>
          </div>
        </form>
      </Dialog>
      </div>
    </AppLayout>
  );
}

