"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      setUser(data);
      toast.success("Welcome back! " + data.fullName);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="bg-card/80 w-full max-w-md border-border/50 shadow-2xl backdrop-blur-md transition-all duration-500">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-xl shadow-sky-500/20">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
            Enter your consciousness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <Button
              type="submit"
              className="h-12 w-full bg-sky-600 text-white font-bold shadow-lg shadow-sky-900/20 transition-all duration-300 hover:bg-sky-500 hover:scale-[1.02] active:scale-95 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-border/50 mt-4">
          <div className="text-muted-foreground text-center text-sm font-medium">
            New to the stream?{" "}
            <Link href="/signup" className="text-sky-500 font-bold hover:text-sky-400 transition-colors">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
