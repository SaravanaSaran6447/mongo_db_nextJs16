"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNoteStore } from "@/store/useNoteStore";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Users,
  Search,
  Loader2,
  Sparkles,
  Filter,
  Database,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layouts/AppLayout";

interface UserData {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { notes, fetchNotes, loading: notesLoading } = useNoteStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userSearchText, setUserSearchText] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetchNotes();
      fetchUsers();
    }
  }, [user, fetchNotes, router]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearchText.toLowerCase()) ||
      u.fullName.toLowerCase().includes(userSearchText.toLowerCase())
  );

  if (!user || user.role !== "admin") return null;

  return (
    <AppLayout>
      <div className="pb-20 pt-10 px-4">
        <header className="mb-16 flex flex-col justify-between gap-6 border-b border-white/5 pb-8 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="mb-2 flex items-center space-x-2 text-amber-500">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Administrative Control
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              System Console
            </h1>
            <p className="text-muted-foreground max-w-md font-medium">
              Maintain the ecosystem. Manage users and monitor the note stream
              effectively.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="mb-1 text-sm font-bold text-sky-400">
                {users.length}
              </div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-widest">
                Total Users
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="mb-1 text-sm font-bold text-amber-400">
                {notes.length}
              </div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-widest">
                Global Notes
              </div>
            </div>
          </div>
        </header>

        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
                <Users className="h-5 w-5 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Core Users</h2>
            </div>
            <div className="group relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                placeholder="Seach user base..."
                className="h-11 w-full rounded-full border-white/10 bg-white/5 pl-10 transition-all focus:border-sky-500/50 md:w-80"
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUsers.map((u) => (
                <Card
                  key={u._id}
                  className="group border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-sky-500/30"
                >
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-xl font-bold shadow-lg shadow-sky-900/20">
                      {u.fullName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">
                        {u.fullName}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground text-xs">
                          @{u.username}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${u.role === "admin" ? "border border-amber-500/20 bg-amber-500/10 text-amber-500" : "border border-sky-500/20 bg-sky-500/10 text-sky-400"}`}
                        >
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4 text-sky-400" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-8 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <Database className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Global Stream</h2>
          </div>

          {notesLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} isAdmin />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
