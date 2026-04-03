"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        username,
        password,
        fullName,
        role,
      });
      setUser(data);
      toast.success("Account created! Welcome, " + data.fullName);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="bg-card/80 w-full max-w-md border-border/50 shadow-2xl backdrop-blur-md transition-all duration-500">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-xl shadow-sky-500/20">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
            Join the digital consciousness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
              <Input
                placeholder="Nathan Drake"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 border-border/50 bg-muted/30 focus:border-sky-500/50 focus:ring-sky-500/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Username</label>
              <Input
                placeholder="nathan_drake"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 border-border/50 bg-muted/30 focus:border-sky-500/50 focus:ring-sky-500/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-border/50 bg-muted/30 focus:border-sky-500/50 focus:ring-sky-500/20 rounded-xl"
              />
            </div>
            
            <div className="flex flex-col space-y-3 pt-2">
              <span className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Role</span>
              <div className="flex items-center space-x-3 bg-muted/30 p-1 rounded-2xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                    role === "user" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                    role === "admin" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Admin
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-sky-600 text-white font-bold shadow-lg shadow-sky-900/20 transition-all duration-300 hover:bg-sky-500 hover:scale-[1.02] active:scale-95 rounded-xl mt-4"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-5 w-5" />
              )}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-border/50 mt-4">
          <div className="text-muted-foreground text-center text-sm font-medium">
            Already in the stream?{" "}
            <Link href="/login" className="text-sky-500 font-bold hover:text-sky-400 transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
