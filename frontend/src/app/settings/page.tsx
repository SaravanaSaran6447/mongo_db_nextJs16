"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  ShieldCheck,
  Loader2,
  Save,
  RefreshCw,
  Bell,
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AppLayout from "@/components/layouts/AppLayout";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", { fullName, password });
      setUser({ ...user, ...data });
      toast.success("Identity updated in the vault");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    
    // VALIDATION: Prevent empty or malformed PINs
    if (!cleanPin) return toast.error("Please enter a new security PIN");
    if (cleanPin.length !== 4 || isNaN(Number(cleanPin))) {
      return toast.error("PIN must be exactly 4 numeric digits");
    }

    setPinLoading(true);
    try {
      await api.put("/users/pin", { pin: cleanPin });
      toast.success("Security layer rotated successfully");
      setPin("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Security rotation failed");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Vault Command</h1>
          <p className="text-muted-foreground text-sm font-medium">Configure your workspace and security protocols.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span>Identity</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Public Persona</CardTitle>
                <CardDescription>Manage how you are identified across the NoteStream network.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white/5 border-white/10 focus:ring-sky-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Username</label>
                      <Input
                        value={user.username}
                        disabled
                        className="bg-white/5 border-white/5 opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Security Phrase (New Password)</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/10 focus:ring-sky-500/50"
                      placeholder="Leave blank to maintain current phrase"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full sm:w-auto px-8 bg-sky-600 hover:bg-sky-500 font-bold shadow-lg shadow-sky-900/20"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Commit Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Vault Access</CardTitle>
                <CardDescription>Rotate your secondary encryption PIN for enhanced vault protection.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePin} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="relative">
                      <Input
                        type="password"
                        maxLength={4}
                        placeholder="0000"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="h-20 w-64 text-center font-mono text-5xl tracking-[0.5em] bg-white/5 border-white/20 focus:border-amber-500/50 focus:ring-amber-500/20"
                      />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 px-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                        Input Required
                      </div>
                    </div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      Enter a 4-digit code to authorize vault entry
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={pinLoading}
                    className="h-11 w-full bg-amber-600 hover:bg-amber-500 font-bold shadow-lg shadow-amber-900/20"
                  >
                    {pinLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Authorize & Rotate PIN
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="border-t border-white/5 pt-6 bg-white/[0.02]">
                <div className="flex items-center space-x-3 text-amber-500/60">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-xs font-medium">Your PIN is encrypted and never stored in plain text.</p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
